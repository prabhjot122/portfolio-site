"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Atmosphere — the sky.
 *
 * One canvas, one program, one render loop, behind everything.
 *
 * WHAT CHANGED FROM THE FIRST VERSION
 * The first pass held the whole sky inside a 3.5% luminance band, which
 * was contrast-safe and completely invisible — the page read as flat
 * cream. Darkening --color-ink-3 to #625950 bought enough headroom to
 * roughly double that range, and this version spends it: a slow
 * domain-warped light field, a sun that tracks scroll, and a warm pool
 * that follows the pointer.
 *
 * NO THREE.JS. A fullscreen quad with one fragment shader; three.js
 * would have been ~150KB gzipped for the same pixels. Zero dependencies
 * added.
 *
 * PERFORMANCE
 * The field is noise-based, so cost is per-pixel and would be real at
 * native resolution on a mid-range Android. It renders at HALF
 * resolution and is scaled up by CSS — for a soft, low-frequency
 * gradient field the difference is not visible, and it cuts fragment
 * work to a quarter. Combined with the DPR clamp, a 1920-wide screen
 * shades roughly 1200x670 pixels rather than 5.5M.
 *
 * CONTRAST
 * Text has to clear AA against every pixel this can produce, so the
 * output range is a hard constraint, not a preference. Measured by
 * reading the framebuffer back — see the numbers in the README. If you
 * change `deep`, the field amplitude, or the cool tint, re-measure.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;
uniform vec2  uRes;
uniform vec2  uMouse;    // 0..1 uv, already smoothed on the CPU
uniform float uMouseAmt; // 0 when the pointer is away or absent
uniform float uSun;      // 0 = high (top of page), 1 = low (bottom)
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm3(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 2; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// Interleaved gradient noise — blue-noise-ish, no visible grid.
float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 auv = vec2(uv.x * aspect, uv.y);   // aspect-corrected, for round shapes
  float t = uTime;

  // --- palette ---------------------------------------------------
  // All warm. The shade colour was a blue-grey on the theory that
  // outdoor shadow is sky-lit; over a warm ground at these strengths it
  // read as a blue cast sitting on the page rather than as depth.
  vec3 lit   = vec3(0.998, 0.994, 0.986);  // full sun
  vec3 deep  = vec3(0.913, 0.895, 0.868);  // deepest shade
  vec3 warm  = vec3(0.998, 0.968, 0.906);  // sunlight
  vec3 shade = vec3(0.898, 0.878, 0.849);  // warm neutral shade

  // --- base wash -------------------------------------------------
  float g = uv.y;
  g = g * g * (3.0 - 2.0 * g);
  vec3 col = mix(deep, lit, g * 0.72 + 0.24);

  // --- the pointer, as a force -----------------------------------
  // Computed before the field so it can bend it. The cursor does not
  // sit on top of the air, it pushes it — that displacement is most of
  // what makes the reactivity readable, more than the brightness is.
  vec2 mp = vec2(uMouse.x * aspect, uMouse.y);
  float md = length(auv - mp);
  float grip = exp(-md * 2.0) * uMouseAmt;
  vec2 push = normalize(auv - mp + vec2(1e-4)) * grip * 0.22;

  // --- the light field -------------------------------------------
  // A domain warp, so the bands bend and pool instead of running as
  // straight stripes. This is what makes it read as air rather than
  // as a gradient.
  vec2 drift = vec2(t * 0.017, t * -0.011);
  vec2 warp = vec2(
    fbm2(auv * 1.7 + drift),
    fbm2(auv * 1.7 + vec2(4.7, 2.3) - drift)
  );
  float field = fbm3(auv * 2.3 + warp * 0.85 + push + drift * 0.6);

  // Centre it so it lifts and lowers rather than only darkening.
  float lift = (field - 0.5);
  col = mix(col, lit,   max(lift, 0.0) * 0.62);
  col = mix(col, shade, max(-lift, 0.0) * 0.5);

  // --- the sun ---------------------------------------------------
  vec2 sunPos = vec2(0.78 * aspect, mix(0.88, 0.30, uSun));
  float sd = length(auv - sunPos);
  float core = exp(-sd * 3.4);
  float halo = exp(-sd * 1.15);
  col = mix(col, warm, core * 0.42 + halo * 0.20);

  // --- the pointer, as light -------------------------------------
  // Strengths here were 0.34 / 0.30 against a target barely distinct
  // from the base, which made the pool technically present and
  // practically invisible. A wide warm bloom plus a tight bright core
  // is what reads as a light source rather than a smudge.
  float bloom = exp(-md * 1.9) * uMouseAmt;
  float hot   = exp(-md * 4.6) * uMouseAmt;
  col = mix(col, warm, bloom * 0.62);
  col = mix(col, lit,  hot * 0.58);

  // --- vignette --------------------------------------------------
  // Very shallow, and warm rather than black: it seats the content
  // without ever introducing a dark block.
  float vig = length((uv - 0.5) * vec2(1.05, 1.0));
  col = mix(col, shade, smoothstep(0.55, 1.02, vig) * 0.18);

  // --- DITHER ----------------------------------------------------
  // Without this a near-white ramp this shallow bands into stripes.
  float n = ign(gl_FragCoord.xy);
  col += (n - 0.5) / 255.0 * 1.6;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Half resolution. The field is low-frequency; upscaling is invisible. */
const RENDER_SCALE = 0.5;
/** A 3x retina panel would quadruple fill cost for a gradient. */
const DPR_MAX = 1.5;

export function Atmosphere() {
  const canvas = useRef<HTMLCanvasElement>(null);
  /** Null until we know; false means we are showing the CSS fallback. */
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const gl =
      (cv.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ??
      (cv.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setWebgl(false);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setWebgl(false);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebgl(false);
      return;
    }
    gl.useProgram(prog);
    // Note: webgl is NOT set true here. It is set after the first frame
    // actually draws into a non-zero buffer, so the canvas only fades in
    // once there are real pixels behind it. Linking successfully and
    // painting something are not the same claim.

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uSun = gl.getUniformLocation(prog, "uSun");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseAmt = gl.getUniformLocation(prog, "uMouseAmt");

    /*
      Size from the canvas's own box, not from window.innerWidth.

      The window is the wrong source: at mount it can legitimately read 0
      (a pane that has not been laid out, a print/preview context), and
      because the old code only re-measured on `resize` a canvas that
      started at zero stayed a 1x1 backing store forever with no error
      anywhere. The element's own rect is the thing that has to be
      filled, and a ResizeObserver catches it settling regardless of what
      caused it.
    */
    const measure = () => {
      const r = cv.getBoundingClientRect();
      const cssW = r.width || window.innerWidth || 0;
      const cssH = r.height || window.innerHeight || 0;
      return { cssW, cssH };
    };

    const resize = () => {
      const { cssW, cssH } = measure();
      if (cssW < 1 || cssH < 1) return; // not laid out yet; observer will fire
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const w = Math.max(1, Math.floor(cssW * dpr * RENDER_SCALE));
      const h = Math.max(1, Math.floor(cssH * dpr * RENDER_SCALE));
      if (cv.width === w && cv.height === h) return;
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let running = true;
    let frame = 0;
    /** Flips once a real frame has landed; gates the canvas fade-in. */
    let painted = false;

    let sun = 0;
    let sunSmooth = 0;
    let published = -1;

    // Pointer, in uv. Parked centre-ish until the pointer is seen.
    const mouse = { x: 0.5, y: 0.6 };
    const mouseSmooth = { x: 0.5, y: 0.6 };
    let mouseAmt = 0;
    let mouseTarget = 0;

    const start = performance.now();

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sun = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    readScroll();
    sunSmooth = sun;

    const onMove = (e: PointerEvent) => {
      // uv origin is bottom-left in GL, top-left in the DOM.
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1 - e.clientY / window.innerHeight;
      mouseTarget = 1;
    };
    const onLeave = () => {
      mouseTarget = 0;
    };

    const render = () => {
      if (!running) return;

      // Ease toward the scroll target so flicking the wheel does not
      // snap the sun across the sky.
      sunSmooth += (sun - sunSmooth) * 0.06;

      // The pointer pool trails with its own inertia — it is air being
      // disturbed, not a cursor attachment. Rates raised from 0.045 /
      // 0.05: the original took roughly a second to catch up, which
      // reads as unrelated drift rather than as a response.
      mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.11;
      mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.11;
      mouseAmt += (mouseTarget - mouseAmt) * 0.09;

      const time = reduced ? 0 : (performance.now() - start) / 1000;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uSun, reduced ? 0.42 : sunSmooth);
      gl.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y);
      gl.uniform1f(uMouseAmt, reduced ? 0 : mouseAmt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Reveal the canvas only once it has genuinely painted at a real
      // size. Until then the CSS sky underneath is what shows, so a
      // silent WebGL failure degrades to a designed state rather than to
      // a blank page.
      if (!painted && cv.width > 4 && cv.height > 4) {
        painted = true;
        setWebgl(true);
      }

      // Publish the light vector for CSS. Quantised to whole degrees and
      // written only on change — a custom-property write on :root
      // invalidates paint for every element reading it.
      const deg = Math.round(52 - sunSmooth * 40);
      if (deg !== published) {
        published = deg;
        document.documentElement.style.setProperty("--sun-angle", `${deg}deg`);
      }

      frame = requestAnimationFrame(render);
    };

    /*
      Pausing. The canvas is fixed and full-bleed, so it is on screen for
      exactly as long as the tab is visible — visibilitychange is the
      complete implementation of "pause off-screen" here, not an
      approximation. An IntersectionObserver was tried and removed: it
      could only fail closed, parking the loop with nothing to restart it.
    */
    const onVisibility = () => {
      const shouldRun = !document.hidden;
      if (shouldRun === running) return;
      running = shouldRun;
      if (running) frame = requestAnimationFrame(render);
      else cancelAnimationFrame(frame);
    };

    /* Real context loss — GPU reset, memory pressure. Distinct from the
       self-inflicted kind noted in the cleanup below. */
    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(frame);
      setWebgl(false);
    };
    const onRestored = () => {
      setWebgl(true);
      resize();
      running = true;
      frame = requestAnimationFrame(render);
    };

    cv.addEventListener("webglcontextlost", onLost);
    cv.addEventListener("webglcontextrestored", onRestored);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    running = true;
    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("webglcontextlost", onLost);
      cv.removeEventListener("webglcontextrestored", onRestored);
      document.documentElement.style.removeProperty("--sun-angle");

      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);

      /*
        NO loseContext() HERE.

        It was here, and it was the bug. `getContext` hands back the same
        context object for the life of the canvas element, so destroying
        it in cleanup poisons every later mount: React StrictMode runs
        mount → cleanup → mount in development, and the second mount got
        a dead context, failed to compile, and fell through to the static
        fallback with no error. Deleting the buffer, program and shaders
        is the disposal that was actually being asked for.
      */
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/*
        THE BASE SKY — always present, pure CSS.

        This is not a fallback that waits for something to fail. It is
        the floor. The canvas layers on top and only becomes visible once
        WebGL has actually compiled, linked and drawn.

        The previous structure rendered the CSS sky *only* when WebGL was
        known to have failed, which meant any silent failure — a context
        that never painted, a canvas that measured zero, a wedged dev
        server serving stale code — produced a completely flat page with
        no signal that anything was wrong. Making the CSS layer
        unconditional means the atmosphere is guaranteed and WebGL is a
        genuine enhancement.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            // warm sun, upper right
            "radial-gradient(46% 42% at 82% 22%, rgba(255,236,201,0.95) 0%, rgba(255,240,214,0.42) 38%, rgba(255,240,214,0) 70%)," +
            // warm shade pooling lower left
            "radial-gradient(58% 52% at 16% 82%, rgba(226,214,196,0.66) 0%, rgba(230,220,204,0.26) 45%, rgba(232,224,210,0) 72%)," +
            // a second, softer shade mass mid-left for depth
            "radial-gradient(40% 38% at 34% 46%, rgba(228,217,199,0.36) 0%, rgba(228,217,199,0) 68%)," +
            // shallow warm vignette — seats the content, never a dark block
            "radial-gradient(92% 82% at 50% 46%, rgba(255,255,255,0) 38%, rgba(226,215,198,0.44) 100%)," +
            // the ramp
            "linear-gradient(168deg, #FEFDFB 0%, #FAF6F0 40%, #F1EBE2 76%, #EAE3D9 100%)",
        }}
      />

      <canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full transition-opacity duration-700 ease-[var(--ease-exit)]"
        style={{ opacity: webgl === true ? 1 : 0 }}
      />
    </div>
  );
}
