"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Ashima 2D simplex noise + fluid UV displacement of the text texture.
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;       // 0..1, -1,-1 when absent
  uniform float uPixelRatio;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Base fluid motion from two noise octaves.
    float n1 = snoise(uv * 3.0 + vec2(uTime * 0.15, uTime * 0.10));
    float n2 = snoise(uv * 6.0 - vec2(uTime * 0.08, uTime * 0.12));

    // Pointer adds a localized ripple of extra displacement.
    float pointer = 0.0;
    if (uMouse.x >= 0.0) {
      float d = distance(uv, uMouse);
      pointer = smoothstep(0.35, 0.0, d);
    }

    float amp = 0.012 + pointer * 0.03;
    vec2 disp = vec2(n1, n2) * amp;

    vec4 tex = texture2D(uTexture, uv + disp);
    gl_FragColor = tex;
  }
`;

export default function TextDistortion({
  text,
  containerRef,
  className,
  onReady,
}: {
  text: string;
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Offscreen 2D canvas holds the rendered word; uploaded as a texture.
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(textCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uPixelRatio: { value: dpr },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Draw the word into the offscreen canvas using the container's resolved
    // font + color, so it tracks the responsive size and light/dark theme.
    function drawText() {
      const rect = container!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));

      const cs = getComputedStyle(container!);
      const family = cs.fontFamily || "serif";
      const color = cs.color || "#000";
      // leading-none → text height ≈ font size ≈ container height.
      const fontSize = h;

      textCanvas.width = Math.round(w * dpr);
      textCanvas.height = Math.round(h * dpr);

      textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      textCtx.clearRect(0, 0, w, h);
      textCtx.fillStyle = color;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.font = `${fontSize}px ${family}`;
      textCtx.fillText(text, w / 2, h / 2 + fontSize * 0.04);
      texture.needsUpdate = true;

      renderer.setSize(w, h, false);
    }

    drawText();

    const ro = new ResizeObserver(() => drawText());
    ro.observe(container);

    // Redraw on theme toggle (the resolved color changes).
    const mo = new MutationObserver(() => drawText());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    }
    function onPointerLeave() {
      uniforms.uMouse.value.set(-1, -1);
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    const clock = new THREE.Clock();
    let raf = 0;
    let signalled = false;

    function tick() {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      if (!signalled) {
        signalled = true;
        onReady?.();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [text, containerRef, onReady]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
