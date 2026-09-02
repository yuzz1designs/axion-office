import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { AudioLevelRef, AivaVisualState } from "./aivaVisual.types";
import { getAivaStatePresets } from "./aivaStatePresets";

interface AivaParticleSceneProps {
  state: AivaVisualState;
  accentColor: string;
  audioLevel: AudioLevelRef;
  reducedMotion: boolean;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createEntityGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const r1 = seededRandom(index + 1);
    const r2 = seededRandom(index + 73);
    const r3 = seededRandom(index + 151);
    const r4 = seededRandom(index + 281);
    const theta = r1 * Math.PI * 2;
    const vertical = (r2 * 2 - 1) * 1.62;
    const waist = Math.pow(Math.max(0.08, 1 - Math.abs(vertical) / 1.85), 0.44);
    const lobes = 0.72 + Math.sin(theta * 3 + vertical * 1.8) * 0.13 + Math.sin(theta * 7) * 0.05;
    const shell = Math.pow(r3, 0.7);
    const isWisp = r4 > 0.84;
    const drift = isWisp ? 1.25 + Math.pow(r3, 2) * 1.25 : 1;

    const x = Math.cos(theta) * waist * lobes * shell * drift + Math.sin(vertical * 2.2) * 0.18;
    const z = Math.sin(theta) * waist * (0.58 + Math.cos(vertical * 2.7) * 0.09) * shell * drift;
    const y = vertical + Math.sin(theta * 2) * 0.12 + (isWisp ? (r1 - 0.5) * 0.5 : 0);

    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;
    seeds[index] = r4;
    sizes[index] = isWisp ? 0.7 + r2 * 1.2 : 0.9 + r1 * 1.65;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

const vertexShader = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uMotion;
  uniform float uTurbulence;
  uniform float uConcentration;
  uniform float uAudio;
  uniform float uIdle;
  uniform float uReduced;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vIdleShimmer;

  void main() {
    vec3 p = position;
    float activity = mix(1.0, 0.14, uReduced);
    float breath = sin(uTime * 0.72 + aSeed * 14.0) * 0.035 * uMotion * activity;
    float wave = sin(p.y * 3.1 + uTime * (1.0 + uTurbulence) + aSeed * 9.0);
    float idleBreath = sin(uTime * 0.82) * 0.5 + 0.5;
    float idleWave = sin(p.y * 4.2 - uTime * 1.35 + aSeed * 2.4) * 0.5 + 0.5;
    float twist = (0.08 + uTurbulence * 0.22) * wave * activity;
    float c = cos(twist);
    float s = sin(twist);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p += normalize(p + vec3(0.001)) * (breath + wave * uTurbulence * 0.055 * activity);
    p += normalize(p + vec3(0.001)) * uIdle * idleBreath * 0.035 * activity;
    p.x += uIdle * sin(uTime * 0.38 + p.y * 1.7 + aSeed * 5.0) * 0.026 * activity;
    p.y += uIdle * sin(uTime * 0.46 + aSeed * 12.0) * 0.018 * activity;
    p.x += sin(uTime * 1.7 + aSeed * 31.0) * uTurbulence * 0.028 * activity;
    p *= uConcentration + uAudio * (0.08 + aSeed * 0.13);
    p.xy += uPointer * vec2(0.08, 0.045) * (0.3 + aSeed) * activity;

    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (7.35 / -viewPosition.z) * (1.0 + uAudio * 1.4);
    vAlpha = 0.42 + aSeed * 0.58;
    vIdleShimmer = uIdle * pow(idleWave, 8.0) * (0.35 + aSeed * 0.65);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uGlow;
  varying float vAlpha;
  varying float vIdleShimmer;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float particle = smoothstep(0.5, 0.08, distanceToCenter);
    float core = smoothstep(0.22, 0.0, distanceToCenter);
    if (particle < 0.02) discard;
    vec3 shimmerColor = mix(uColor, vec3(0.82, 0.96, 1.0), vIdleShimmer * 0.58);
    float shimmerGlow = 1.0 + vIdleShimmer * 0.75;
    gl_FragColor = vec4(shimmerColor + core * uGlow * 0.18, particle * vAlpha * min(1.0, uGlow) * shimmerGlow);
  }
`;

function createFilament(color: string, index: number) {
  const points: THREE.Vector3[] = [];
  const radius = 1.05 + index * 0.23;
  for (let step = 0; step <= 96; step += 1) {
    const angle = (step / 96) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle * 2 + index) * 0.18,
      Math.sin(angle) * radius * 0.38,
    ));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
  const line = new THREE.Line(geometry, material);
  line.rotation.set(index * 0.52, index * 0.61, index * 0.37);
  return line;
}

export default function AivaParticleScene({ state, accentColor, audioLevel, reducedMotion }: AivaParticleSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const accentRef = useRef(accentColor);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { accentRef.current = accentColor; }, [accentColor]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, reducedMotion ? 1 : 1.65));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
    // Extra framing keeps peripheral fragments inside the canvas during
    // expanded/speaking states, including on wide and short containers.
    camera.position.set(0, 0, 8.35);
    const group = new THREE.Group();
    group.scale.set(1.28, 1.1, 1.24);
    // The responsive grid already centres the WebGL field with the interaction
    // bar. Only a small vertical optical correction is required.
    group.position.set(0, 0.2, 0);
    scene.add(group);

    const geometry = createEntityGeometry(reducedMotion ? 2200 : 6200);
    const uniforms = {
      uTime: { value: 0 },
      uMotion: { value: 0.45 },
      uTurbulence: { value: 0.14 },
      uConcentration: { value: 1 },
      uAudio: { value: 0 },
      uIdle: { value: 1 },
      uReduced: { value: reducedMotion ? 1 : 0 },
      uPointer: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color(accentRef.current) },
      uGlow: { value: 0.72 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const entity = new THREE.Points(geometry, material);
    group.add(entity);

    const filaments = [0, 1, 2].map((index) => createFilament(accentRef.current, index));
    filaments.forEach((line) => group.add(line));

    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        -((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      );
    };
    const onPointerLeave = () => pointerTarget.set(0, 0);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (document.hidden) return;
      const elapsed = clock.getElapsedTime();
      const preset = getAivaStatePresets(accentRef.current)[stateRef.current];
      const ease = reducedMotion ? 0.035 : 0.055;
      uniforms.uTime.value = elapsed;
      uniforms.uMotion.value = THREE.MathUtils.lerp(uniforms.uMotion.value, preset.motion, ease);
      uniforms.uTurbulence.value = THREE.MathUtils.lerp(uniforms.uTurbulence.value, preset.turbulence, ease);
      uniforms.uConcentration.value = THREE.MathUtils.lerp(uniforms.uConcentration.value, preset.concentration, ease);
      uniforms.uGlow.value = THREE.MathUtils.lerp(uniforms.uGlow.value, preset.glow, ease);
      uniforms.uAudio.value = audioLevel.current;
      uniforms.uIdle.value = THREE.MathUtils.lerp(uniforms.uIdle.value, stateRef.current === "idle" ? 1 : 0, ease);
      uniforms.uColor.value.lerp(new THREE.Color(preset.color), ease);
      pointer.lerp(pointerTarget, 0.04);
      uniforms.uPointer.value.copy(pointer);
      const idleDrift = stateRef.current === "idle" ? Math.sin(elapsed * 0.31) * 0.035 : 0;
      group.rotation.y = Math.sin(elapsed * 0.19) * 0.16 + idleDrift + pointer.x * 0.1;
      group.rotation.x = Math.cos(elapsed * 0.14) * 0.025 - pointer.y * 0.035;
      filaments.forEach((line, index) => {
        line.rotation.y += (0.00045 + index * 0.00018) * (reducedMotion ? 0.1 : 1);
        const lineMaterial = line.material as THREE.LineBasicMaterial;
        lineMaterial.color.lerp(new THREE.Color(preset.color), ease);
        lineMaterial.opacity = 0.035 + preset.glow * 0.045 + audioLevel.current * 0.08;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      filaments.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [audioLevel, reducedMotion]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
