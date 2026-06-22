import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

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

// Liquid-chrome fragment shader. A set of inverse-square metaball potentials are
// summed into a scalar field; the field is thresholded into the metal mass and a
// pseudo-normal is read from its gradient (central differences) — a cheap 2.5D
// surface with no raymarching. The view ray reflects off that normal into a
// reconstructed studio environment (sky ramp + warm horizon + two key/fill bands
// + three directional light lobes), then fresnel, a key specular and an ACES
// tone map finish the chrome. One blob tracks the pointer when interactive.
const FRAG_SRC = `precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uSpeed;
uniform float uScale;
uniform float uExposure;
uniform float uRoughness;
uniform vec3 uTint;
uniform float uInteractive;

#define NUM_BALLS 5

float saturate(float x) { return clamp(x, 0.0, 1.0); }

float lightLobe(vec3 ray, vec3 dir, float sharp, float gain) {
  return pow(max(dot(ray, normalize(dir)), 0.0), sharp) * gain;
}

float horizontalBand(vec3 ray, float y, float w, float soft) {
  float d = abs(ray.y - y);
  return smoothstep(w + soft, w, d);
}

vec3 studioEnvironment(vec3 ray) {
  float sky = saturate(ray.y * 0.5 + 0.5);
  vec3 low = vec3(0.010, 0.012, 0.017);
  vec3 high = vec3(0.78, 0.84, 0.90);
  vec3 color = mix(low, high, sky);

  float horizon = exp(-abs(ray.y) * 9.5);
  color += horizon * vec3(0.38, 0.43, 0.48) * 1.42;

  color += horizontalBand(ray, 0.43, 0.055, 0.11) * vec3(2.00, 2.15, 2.30) * 1.45;
  color += horizontalBand(ray, -0.16, 0.035, 0.09) * vec3(0.56, 0.66, 0.78) * 1.45;

  color += lightLobe(ray, vec3(-0.35, 0.82, 0.45), 110.0, 3.8) * vec3(1.00, 0.95, 0.78) * 1.28;
  color += lightLobe(ray, vec3(0.82, 0.26, 0.48), 72.0, 2.4) * vec3(0.61, 0.49, 1.00) * 1.38;
  color += lightLobe(ray, vec3(-0.92, -0.20, 0.34), 52.0, 1.25) * vec3(0.96, 0.72, 0.58) * 1.55;

  return color;
}

vec3 acesToneMap(vec3 color) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
}

float field(vec2 p) {
  float sum = 0.0;
  float t = uTime * uSpeed;
  vec2 pst = (uPointer - 0.5);
  pst.x *= uResolution.x / uResolution.y;
  for (int i = 0; i < NUM_BALLS; i++) {
    float fi = float(i);
    vec2 c = vec2(
      0.30 * sin(t * 0.60 + fi * 1.7) + 0.12 * cos(t * 0.27 + fi * 2.3),
      0.30 * cos(t * 0.50 + fi * 2.1) + 0.12 * sin(t * 0.31 + fi * 1.3)
    );
    if (i == 0) {
      c = mix(c, pst, uInteractive);
    }
    float r = (0.16 + 0.05 * sin(t * 0.7 + fi)) * uScale;
    vec2 d = p - c;
    sum += (r * r) / (dot(d, d) + 0.0004);
  }
  return sum;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 st = vUv - 0.5;
  st.x *= aspect;

  float f = field(st);
  float threshold = 1.0;
  float mask = smoothstep(threshold * 0.92, threshold * 1.18, f);

  float e = 0.0016;
  float fx = field(st + vec2(e, 0.0)) - field(st - vec2(e, 0.0));
  float fy = field(st + vec2(0.0, e)) - field(st - vec2(0.0, e));
  vec2 grad = vec2(fx, fy) / (2.0 * e);
  vec3 normal = normalize(vec3(-grad * 0.06, 1.0));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 refl = reflect(-viewDir, normal);

  vec3 sharp = studioEnvironment(refl);
  vec3 blurred = studioEnvironment(normalize(mix(refl, normal, 0.65)));
  vec3 chrome = mix(sharp, blurred, clamp(uRoughness, 0.0, 1.0));

  float ndv = saturate(dot(normal, viewDir));
  float fresnel = pow(1.0 - ndv, 4.1);

  vec3 tint = mix(vec3(0.92, 0.96, 1.0), uTint, 0.6);
  vec3 color = chrome * tint;
  color += fresnel * vec3(0.78, 0.90, 1.0) * 1.35;

  vec3 halfKey = normalize(normalize(vec3(-0.45, 0.75, 0.55)) + viewDir);
  float keySpec = pow(saturate(dot(normal, halfKey)), 90.0);
  color += keySpec * vec3(1.0, 0.96, 0.86) * 1.6;

  color *= uExposure;
  color = acesToneMap(color);
  color = pow(color, vec3(1.0 / 2.2));

  vec3 bg = mix(vec3(0.012, 0.014, 0.022), vec3(0.035, 0.040, 0.055), saturate(vUv.y));
  float vig = smoothstep(1.15, 0.35, length(st));
  bg *= 0.6 + 0.4 * vig;

  vec3 outColor = mix(bg, color, mask);
  gl_FragColor = vec4(outColor, 1.0);
}`;

const compileShader = (gl, type, src) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('LiquidChrome shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

// A full-bleed WebGL background of liquid chrome: drifting metaballs shaded with
// a reconstructed studio environment (reflections, fresnel, key specular, ACES
// tone map). One blob tracks the pointer. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion by painting one static frame.
export default function LiquidChrome({
  speed = 1,
  scale = 1,
  exposure = 1.1,
  roughness = 0.14,
  tint = '#74e7ff',
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
      console.warn('LiquidChrome: WebGL unavailable; showing static backdrop.');
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
      console.error('LiquidChrome program link error:', gl.getProgramInfoLog(program));
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
    const uExposure = u('uExposure');
    const uRoughness = u('uRoughness');
    const uTint = u('uTint');
    const uInteractive = u('uInteractive');
    const [tr, tg, tb] = hexToRgb(tint);

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
      gl.uniform1f(uExposure, exposure);
      gl.uniform1f(uRoughness, roughness);
      gl.uniform3f(uTint, tr, tg, tb);
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
  }, [speed, scale, exposure, roughness, tint, interactive, reduceMotion]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full min-h-[200px] overflow-hidden bg-[#05060a] ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
