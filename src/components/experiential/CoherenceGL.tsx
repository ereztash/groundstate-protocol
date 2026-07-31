import { useEffect, useRef } from "react";

/**
 * Tier-2 WebGL expression of the coherence motif: rods that start scattered in
 * 3D and rotate into a single aligned axis, the lead rod in copper. The whole
 * group eases toward the pointer, so it responds to the mouse.
 *
 * Client-only and lazy-loaded. It renders as an overlay on top of the
 * CoherenceField SVG, which stays as the static / reduced-motion / prerender
 * fallback (see CoherenceVisual). Purely decorative → aria-hidden.
 *
 * Written against the WebGL context directly. It previously used three.js and
 * @react-three/fiber, which cost 216 kB gzip — the largest asset in the build by
 * a factor of five, and over the 150 kB budget the audit recorded — to draw
 * seven boxes lit by two lights. Nothing else in the app imports three, so the
 * whole dependency was this file. What it needs from a 3D engine is a
 * perspective matrix, a cube, and Lambert shading, which is the code below.
 *
 * The figure is unchanged: same rod count and dimensions, same start
 * orientations, same easeOutCubic over ~2s, same pointer follow, same colours,
 * and an ambient plus directional pair matching the previous intensities.
 */

const COUNT = 7;

/**
 * sRGB to linear. three.js did this on every colour fed to a material and
 * encoded back to sRGB on output, so lighting was computed in linear space.
 * Skipping the round-trip renders the rods visibly brighter and the copper more
 * saturated than the figure this replaces, which is the one difference a
 * side-by-side capture showed.
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearRgb(hex: number): number[] {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].map((v) =>
    srgbToLinear(v / 255)
  );
}

const TEAL = linearRgb(0x2c5f70);
const CREAM = linearRgb(0xe8e4da);
const COPPER = linearRgb(0xb87333);
const LEAD = Math.floor(COUNT / 2);

/** Matched to the previous ambientLight/directionalLight intensities. */
const AMBIENT = 0.85;
const DIRECTIONAL = 0.55;
/** Direction toward the light, from the old directionalLight position [2,3,4]. */
const LIGHT_DIR = (() => {
  const [x, y, z] = [2, 3, 4];
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
})();

const ROD = { hx: 1.9 / 2, hy: 0.055 / 2, hz: 0.055 / 2 };
const CAMERA_Z = 4;
const FOV_Y = (45 * Math.PI) / 180;

/** Column-major 4x4, the layout uniformMatrix4fv expects untransposed. */
type Mat4 = Float32Array;

function identity(): Mat4 {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

function multiply(a: Mat4, b: Mat4, out = new Float32Array(16)): Mat4 {
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

function rotationX(a: number): Mat4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const m = identity();
  m[5] = c;
  m[6] = s;
  m[9] = -s;
  m[10] = c;
  return m;
}

function rotationY(a: number): Mat4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const m = identity();
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
}

function rotationZ(a: number): Mat4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const m = identity();
  m[0] = c;
  m[1] = s;
  m[4] = -s;
  m[5] = c;
  return m;
}

function translation(x: number, y: number, z: number): Mat4 {
  const m = identity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

/** Upper-left 3x3, which is the correct normal matrix while there is no scale. */
function normalMatrix(m: Mat4): Float32Array {
  return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]);
}

/** A cuboid as 24 vertices and 36 indices, so each face gets its own normal. */
function buildRod() {
  const { hx, hy, hz } = ROD;
  const faces: [number[], number[][]][] = [
    [[1, 0, 0], [[hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz], [hx, -hy, hz]]],
    [[-1, 0, 0], [[-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz], [-hx, -hy, -hz]]],
    [[0, 1, 0], [[-hx, hy, -hz], [-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz]]],
    [[0, -1, 0], [[-hx, -hy, hz], [-hx, -hy, -hz], [hx, -hy, -hz], [hx, -hy, hz]]],
    [[0, 0, 1], [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]]],
    [[0, 0, -1], [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]]],
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  faces.forEach(([normal, corners], f) => {
    corners.forEach((corner) => {
      positions.push(...corner);
      normals.push(...normal);
    });
    const base = f * 4;
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  });

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

const VERT = `
attribute vec3 aPos;
attribute vec3 aNormal;
uniform mat4 uProj;
uniform mat4 uModelView;
uniform mat3 uNormalMat;
varying vec3 vNormal;
varying vec3 vViewPos;
void main() {
  vec4 mv = uModelView * vec4(aPos, 1.0);
  vViewPos = mv.xyz;
  vNormal = uNormalMat * aNormal;
  gl_Position = uProj * mv;
}`;

/**
 * Lambert plus a low-exponent specular. The previous material was a
 * meshStandardMaterial at roughness 0.45 / metalness 0.15, whose contribution at
 * this scale — rods a few pixels thick — is a soft sheen along the top edge.
 * That is what the specular term stands in for.
 */
const FRAG = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vViewPos;
uniform vec3 uColor;
uniform vec3 uEmissive;
uniform float uEmissiveIntensity;
uniform vec3 uLightDir;
uniform float uAmbient;
uniform float uDirectional;
void main() {
  vec3 n = normalize(vNormal);
  float diffuse = max(dot(n, uLightDir), 0.0);
  vec3 viewDir = normalize(-vViewPos);
  vec3 halfDir = normalize(uLightDir + viewDir);
  float specular = pow(max(dot(n, halfDir), 0.0), 24.0) * 0.12;
  vec3 color = uColor * (uAmbient + diffuse * uDirectional) + vec3(specular);
  color += uEmissive * uEmissiveIntensity;
  // Linear to sRGB, the encode half of the round-trip three.js applied on
  // output. Without it the lighting maths is correct and the result still looks
  // wrong, because it is being shown in the wrong space.
  color = clamp(color, 0.0, 1.0);
  vec3 encoded = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(vec3(0.0031308), color)
  );
  gl_FragColor = vec4(encoded, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const CoherenceGL = ({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
      })) as WebGLRenderingContext | null;
    // CoherenceVisual already gates on WebGL support before importing this
    // chunk, so reaching here without a context means the environment changed
    // under us. The SVG tier is still underneath either way.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const rod = buildRod();
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rod.positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rod.normals, gl.STATIC_DRAW);
    const aNormal = gl.getAttribLocation(program, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rod.indices, gl.STATIC_DRAW);

    const u = {
      proj: gl.getUniformLocation(program, "uProj"),
      modelView: gl.getUniformLocation(program, "uModelView"),
      normalMat: gl.getUniformLocation(program, "uNormalMat"),
      color: gl.getUniformLocation(program, "uColor"),
      emissive: gl.getUniformLocation(program, "uEmissive"),
      emissiveIntensity: gl.getUniformLocation(program, "uEmissiveIntensity"),
      lightDir: gl.getUniformLocation(program, "uLightDir"),
      ambient: gl.getUniformLocation(program, "uAmbient"),
      directional: gl.getUniformLocation(program, "uDirectional"),
    };

    gl.uniform3fv(u.lightDir, LIGHT_DIR);
    gl.uniform1f(u.ambient, AMBIENT);
    gl.uniform1f(u.directional, DIRECTIONAL);
    gl.enable(gl.DEPTH_TEST);

    const base = variant === "dark" ? CREAM : TEAL;

    // Deterministic scattered start orientations, unchanged from the three.js
    // version (no RNG — these are design-controlled).
    const rods = Array.from({ length: COUNT }, (_, i) => ({
      y: (i - (COUNT - 1) / 2) * 0.4,
      lead: i === LEAD,
      from: [
        ((i * 1.9) % 2.6) - 1.3,
        ((i * 2.4) % 3.0) - 1.5,
        ((i * 1.3) % 2.2) - 1.1,
      ] as const,
    }));

    let proj = identity();
    const resize = () => {
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      proj = perspective(FOV_Y, w / h, 0.1, 100);
    };
    resize();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);

    // Normalised device coords across the canvas, y up, matching what the
    // previous implementation read from the renderer state.
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const view = translation(0, 0, -CAMERA_Z);
    const groupRot = { x: 0, y: 0 };
    let align = 0;
    let last = 0;
    let start = 0;
    let raf = 0;
    const scratch = new Float32Array(16);

    const frame = (now: number) => {
      if (!start) start = now;
      const delta = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const elapsed = (now - start) / 1000;

      // Ease alignment 0→1 over ~2s, easeOutCubic.
      align = Math.min(1, align + delta * 0.5);
      const e = 1 - Math.pow(1 - align, 3);

      const targetY = pointer.x * 0.4 + Math.sin(elapsed * 0.3) * 0.06;
      const targetX = -pointer.y * 0.25;
      groupRot.y += (targetY - groupRot.y) * 0.05;
      groupRot.x += (targetX - groupRot.x) * 0.05;

      const group = multiply(rotationY(groupRot.y), rotationX(groupRot.x));
      const viewGroup = multiply(view, group);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(u.proj, false, proj);

      for (const r of rods) {
        const rx = r.from[0] * (1 - e);
        const ry = r.from[1] * (1 - e);
        const rz = r.from[2] * (1 - e);
        const spin = multiply(multiply(rotationX(rx), rotationY(ry)), rotationZ(rz));
        const model = multiply(translation(0, r.y, 0), spin);
        const modelView = multiply(viewGroup, model, scratch);

        gl.uniformMatrix4fv(u.modelView, false, modelView);
        gl.uniformMatrix3fv(u.normalMat, false, normalMatrix(modelView));
        gl.uniform3fv(u.color, r.lead ? COPPER : base);
        gl.uniform3fv(u.emissive, r.lead ? COPPER : [0, 0, 0]);
        gl.uniform1f(u.emissiveIntensity, r.lead ? 0.18 : 0);
        gl.drawElements(gl.TRIANGLES, rod.indices.length, gl.UNSIGNED_SHORT, 0);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(normBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // Frees the GPU context rather than waiting for GC, which matters when
      // the visitor navigates between routes that each mount one.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [variant]);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default CoherenceGL;
