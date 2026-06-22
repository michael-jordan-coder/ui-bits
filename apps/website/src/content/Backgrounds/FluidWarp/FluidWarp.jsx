import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './FluidWarp.css';

const hexToRgb = hex => {
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
uniform float uScale;
uniform float uWarp;
uniform float uSwirl;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uInteractive;

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
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = p * 2.0 + 11.3;
    amp *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 st = vUv - 0.5;
  st.x *= aspect;
  vec2 ptr = uPointer - 0.5;
  ptr.x *= aspect;

  float t = uTime * uSpeed * 0.2;

  vec2 toP = st - ptr;
  float dist = length(toP);
  float falloff = exp(-dist * 3.5) * uSwirl * uInteractive;
  st = ptr + rot(falloff * 3.0) * toP;
  st += normalize(toP + 0.0001) * falloff * 0.10;

  vec2 p = st * (2.4 * uScale);

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(
    fbm(p + uWarp * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + uWarp * q + vec2(8.3, 2.8) - 0.13 * t)
  );
  float f = fbm(p + uWarp * r);

  vec3 col = mix(uColorA, uColorB, clamp(f * f * 1.4, 0.0, 1.0));
  col = mix(col, vec3(0.02, 0.03, 0.06), clamp(length(q) - 0.6, 0.0, 1.0));
  col += uColorB * 0.4 * pow(clamp(r.x, 0.0, 1.0), 3.0);
  col += vec3(0.6, 0.8, 1.0) * 0.25 * smoothstep(0.55, 0.0, dist) * falloff;

  col = col / (col + 0.6);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}`;

const compileShader = (gl, type, src) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('FluidWarp shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

// A full-bleed WebGL background of domain-warped fbm. Two octave-stacked value-
// noise fields warp the sample coordinates twice (Iñigo Quílez style), so the
// ink folds and flows; a two-tone neon palette is shaped by the warp fields.
// When interactive, the pointer rotates and pushes the space around it, stirring
// a swirling current into the fluid. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion by painting one static frame.
export default function FluidWarp({
  speed = 1,
  scale = 1,
  warp = 1,
  swirl = 1,
  colorA = '#2c0e63',
  colorB = '#26d6e6',
  interactive = true,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false }) || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('FluidWarp: WebGL unavailable; showing static backdrop.');
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
      console.error('FluidWarp program link error:', gl.getProgramInfoLog(program));
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const u = name => gl.getUniformLocation(program, name);
    const uTime = u('uTime');
    const uResolution = u('uResolution');
    const uPointer = u('uPointer');
    const uSpeed = u('uSpeed');
    const uScale = u('uScale');
    const uWarp = u('uWarp');
    const uSwirl = u('uSwirl');
    const uColorA = u('uColorA');
    const uColorB = u('uColorB');
    const uInteractive = u('uInteractive');
    const [ar, ag, ab] = hexToRgb(colorA);
    const [br, bg, bb] = hexToRgb(colorB);

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

    const draw = now => {
      pointer.x += (target.x - pointer.x) * 0.08;
      pointer.y += (target.y - pointer.y) * 0.08;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uWarp, warp);
      gl.uniform1f(uSwirl, swirl);
      gl.uniform3f(uColorA, ar, ag, ab);
      gl.uniform3f(uColorB, br, bg, bb);
      gl.uniform1f(uInteractive, interactive ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = event => {
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
  }, [speed, scale, warp, swirl, colorA, colorB, interactive, reduceMotion]);

  return (
    <div ref={wrapRef} className={`fluid-warp ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="fluid-warp-canvas" />
    </div>
  );
}
