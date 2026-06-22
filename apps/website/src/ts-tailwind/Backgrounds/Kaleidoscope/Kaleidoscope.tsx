import { useEffect, useRef, type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

const VERT_SRC = `attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG_SRC = `precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uSpeed;
uniform float uSegments;
uniform float uZoom;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uInteractive;

#define PI 3.14159265359

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = p * 2.0 + 7.1;
    amp *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 st = vUv - 0.5;
  st.x *= aspect;
  vec2 ptr = uPointer - 0.5;
  ptr.x *= aspect;

  float pAng = atan(ptr.y, ptr.x) * uInteractive;
  float pZoom = 1.0 + length(ptr) * 0.8 * uInteractive;

  float t = uTime * uSpeed * 0.3;
  vec2 p = st * uZoom * pZoom;

  float r = length(p);
  float a = atan(p.y, p.x) + t * 0.4 + pAng;

  float seg = max(2.0, floor(uSegments));
  float k = 2.0 * PI / seg;
  a = mod(a, k);
  a = abs(a - k * 0.5);

  vec2 q = vec2(cos(a), sin(a)) * r;
  q += 0.15 * vec2(cos(t * 1.3), sin(t * 1.1));

  float bands = 0.5 + 0.5 * sin(r * 18.0 - t * 2.0 + fbm(q * 3.0 + t) * 4.0);
  float tex = fbm(q * 4.0 + t * 0.5);
  float mixv = clamp(bands * 0.7 + tex * 0.6, 0.0, 1.0);

  vec3 col = mix(uColorA, uColorB, mixv);
  col = mix(col, uColorC, smoothstep(0.5, 1.0, tex));
  col *= 0.5 + 0.6 * bands;
  col += uColorC * 0.3 * smoothstep(0.04, 0.0, abs(r - 0.5));

  col *= smoothstep(1.25, 0.2, r);
  col = col / (col + 0.7);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}`;

const compileShader = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Kaleidoscope shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

// A full-bleed WebGL kaleidoscope. Screen space is taken to polar coordinates and
// the angle is folded into N mirrored segments, then an animated value-noise fbm
// field — concentric bands plus drifting sparkle — is sampled in the folded
// space. When interactive, the pointer steers the rotation (its angle) and the
// zoom (its distance). Single rAF loop, dpr-scaled canvas, ResizeObserver. Honors
// prefers-reduced-motion by painting one static frame.
export interface KaleidoscopeProps extends HTMLAttributes<HTMLDivElement> {
  speed?: number;
  segments?: number;
  zoom?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  interactive?: boolean;
  className?: string;
}

export default function Kaleidoscope({
  speed = 1,
  segments = 8,
  zoom = 1,
  colorA = '#1a0b3a',
  colorB = '#ff3d81',
  colorC = '#3ad6ff',
  interactive = true,
  className = '',
  ...rest
}: KaleidoscopeProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const gl = (canvas.getContext('webgl', { antialias: true, alpha: false }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('Kaleidoscope: WebGL unavailable; showing static backdrop.');
      return undefined;
    }

    const reduce = !!reduceMotion;
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Kaleidoscope program link error:', gl.getProgramInfoLog(program));
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uTime = u('uTime');
    const uResolution = u('uResolution');
    const uPointer = u('uPointer');
    const uSpeed = u('uSpeed');
    const uSegments = u('uSegments');
    const uZoom = u('uZoom');
    const uColorA = u('uColorA');
    const uColorB = u('uColorB');
    const uColorC = u('uColorC');
    const uInteractive = u('uInteractive');
    const [ar, ag, ab] = hexToRgb(colorA);
    const [br, bg, bb] = hexToRgb(colorB);
    const [cr, cg, cb] = hexToRgb(colorC);

    let raf = 0;
    let width = 0;
    let height = 0;
    const start = performance.now();
    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      pointer.x += (target.x - pointer.x) * 0.08;
      pointer.y += (target.y - pointer.y) * 0.08;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uSegments, segments);
      gl.uniform1f(uZoom, zoom);
      gl.uniform3f(uColorA, ar, ag, ab);
      gl.uniform3f(uColorB, br, bg, bb);
      gl.uniform3f(uColorC, cr, cg, cb);
      gl.uniform1f(uInteractive, interactive ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(wrap);
    if (interactive) canvas.addEventListener('pointermove', onPointerMove);

    if (reduce) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [speed, segments, zoom, colorA, colorB, colorC, interactive, reduceMotion]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full min-h-[200px] overflow-hidden bg-[#05060a] ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
