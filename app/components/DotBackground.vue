<script setup lang="ts">
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";

const DOT_COUNT_X = 600;
const DOT_COUNT_Z = 200;
const SPACING = 2;
const DOT_COLOR = 0x22c55e;
const DOT_SIZE = 1;
const FINAL_DOT_OPACITY = 0.7;

const FADE_IN_MS = 600;
const CAMERA_TWEEN_MS = 2000;
const ASYMPTOTE_INTRO_MS = 1500;
const MOBILE_VIEWPORT_PX = 768;

function isMobileViewport(): boolean {
  return window.innerWidth < MOBILE_VIEWPORT_PX;
}

const START_CAMERA = new THREE.Vector3(0, 60, 0.01);
const END_CAMERA = new THREE.Vector3(0, 30, 40);
const END_LOOK = new THREE.Vector3(0, 30, 0);
const SPHERE_CAMERA = new THREE.Vector3(-60, 0, 250);
const SPHERE_LOOK = new THREE.Vector3(-60, 0, 0);

const END_CAMERA_MOBILE = new THREE.Vector3(30, 40, 70);
const END_LOOK_MOBILE = new THREE.Vector3(30, 30, 0);
const SPHERE_CAMERA_MOBILE = new THREE.Vector3(0, 55, 320);
const SPHERE_LOOK_MOBILE = new THREE.Vector3(0, 55, 0);
const SHRINK_CAMERA_MOBILE = new THREE.Vector3(0, 0, 340);
const SHRINK_LOOK_MOBILE = new THREE.Vector3(0, 0, 0);
const UNFURL_CAMERA_MOBILE = new THREE.Vector3(0, 100, 320);
const UNFURL_LOOK_MOBILE = new THREE.Vector3(0, -30, 0);

const ASYMPTOTE_X = 60;
const ASYMPTOTE_Z = -25;
const ASYMPTOTE_A = 2000;
const ASYMPTOTE_FALLOFF = 1.5;
const ASYMPTOTE_MAX_Y = 1000;
const SPHERE_RADIUS = 200;
const SPHERE_SPIN_SPEED = 0.001;
const SHRINK_CAMERA = new THREE.Vector3(0, 0, 250);
const SHRINK_LOOK = new THREE.Vector3(0, 0, 0);
const UNFURL_CAMERA = new THREE.Vector3(0, 80, 250);
const UNFURL_LOOK = new THREE.Vector3(0, -30, 0);
const SUN_START_X = -400;
const SUN_END_X = 400;
const SUN_MAX_SIZE = 10;
const ARC_HEIGHT = 200;
const BLOOM_STRENGTH = 1.5;
const BLOOM_RADIUS = 0.6;
const BLOOM_THRESHOLD = 0.0;
const WAVE_AMPLITUDE = 5;
const WAVE_FREQ_X = 0.05;
const WAVE_FREQ_Z = 0.07;
const WAVE_SPEED_X = 1.2;
const WAVE_SPEED_Z = 0.9;
const WAVE_PHASE_X = 0.7;
const WAVE_PHASE_Z = 2.3;
const UNFURL_TARGET = new THREE.Vector3(0, 0, 0);
const FLOAT_START_Y = -500;

const FOG_COLOR = 0x0d0d0d;
const FOG_NEAR = 150;
const FOG_FAR = 250;

const DEBUG_AXES = false;
const AXES_LENGTH = 100;

const canvasContainer = ref<HTMLDivElement | null>(null);
const faded = ref(false);
const isMobile = useIsMobile();

let renderer: THREE.WebGLRenderer | null = null;
let composer: EffectComposer | null = null;
let bloomPass: UnrealBloomPass | null = null;
let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let dotTexture: THREE.Texture | null = null;
let sunGeometry: THREE.SphereGeometry | null = null;
let sunMaterial: THREE.MeshBasicMaterial | null = null;
let scrollTimeline: gsap.core.Timeline | null = null;
let introTween: gsap.core.Tween | null = null;
let rafId = 0;
let resizeHandler: (() => void) | null = null;

function createCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function makeAxisLabel(
  text: string,
  position: THREE.Vector3,
  color: string
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    fog: false,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.position.copy(position);
  sprite.scale.set(20, 10, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function buildShapes(): {
  flat: Float32Array;
  asymptote: Float32Array;
  sphere: Float32Array;
  wave: Float32Array;
} {
  const count = DOT_COUNT_X * DOT_COUNT_Z;
  const flat = new Float32Array(count * 3);
  const asymptote = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);

  const waveSpacing = SPACING * 2;

  for (let i = 0; i < DOT_COUNT_X; i++) {
    for (let j = 0; j < DOT_COUNT_Z; j++) {
      const idx = (i * DOT_COUNT_Z + j) * 3;
      const x = (i - DOT_COUNT_X / 2) * SPACING;
      const z = (j - DOT_COUNT_Z / 2) * SPACING;

      flat[idx] = x;
      flat[idx + 1] = 0;
      flat[idx + 2] = z;

      const dx = x - ASYMPTOTE_X;
      const dz = z - ASYMPTOTE_Z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const yA =
        dist === 0
          ? ASYMPTOTE_MAX_Y
          : clamp(
              ASYMPTOTE_A / Math.pow(dist, ASYMPTOTE_FALLOFF),
              0,
              ASYMPTOTE_MAX_Y
            );
      asymptote[idx] = x;
      asymptote[idx + 1] = yA;
      asymptote[idx + 2] = z;

      const lat = (i / DOT_COUNT_X - 0.5) * Math.PI;
      const lon = (j / DOT_COUNT_Z - 0.5) * 2 * Math.PI;
      const cosLat = Math.cos(lat);
      sphere[idx] = SPHERE_RADIUS * cosLat * Math.cos(lon);
      sphere[idx + 1] = SPHERE_RADIUS * Math.sin(lat);
      sphere[idx + 2] = SPHERE_RADIUS * cosLat * Math.sin(lon);

      wave[idx] = (i - DOT_COUNT_X / 2) * waveSpacing;
      wave[idx + 1] = 0;
      wave[idx + 2] = (j - DOT_COUNT_Z / 2) * waveSpacing;
    }
  }

  return { flat, asymptote, sphere, wave };
}

onMounted(() => {
  if (import.meta.server) return;
  const container = canvasContainer.value;
  if (!container) return;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

  if (DEBUG_AXES) {
    const axesHelper = new THREE.AxesHelper(AXES_LENGTH);
    (axesHelper.material as THREE.LineBasicMaterial).fog = false;
    (axesHelper.material as THREE.LineBasicMaterial).depthTest = false;
    axesHelper.renderOrder = 998;
    scene.add(axesHelper);
    scene.add(
      makeAxisLabel("+X", new THREE.Vector3(AXES_LENGTH + 10, 0, 0), "#ff5555")
    );
    scene.add(
      makeAxisLabel("+Y", new THREE.Vector3(0, AXES_LENGTH + 10, 0), "#55ff55")
    );
    scene.add(
      makeAxisLabel("+Z", new THREE.Vector3(0, 0, AXES_LENGTH + 10), "#5555ff")
    );
  }

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
  const lookTarget = new THREE.Vector3(0, 0, 0);
  const sunProjVec = new THREE.Vector3();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mobile = isMobileViewport();
  const endCamera = mobile ? END_CAMERA_MOBILE : END_CAMERA;
  const endLook = mobile ? END_LOOK_MOBILE : END_LOOK;
  const sphereCamera = mobile ? SPHERE_CAMERA_MOBILE : SPHERE_CAMERA;
  const sphereLook = mobile ? SPHERE_LOOK_MOBILE : SPHERE_LOOK;
  const shrinkCamera = mobile ? SHRINK_CAMERA_MOBILE : SHRINK_CAMERA;
  const shrinkLook = mobile ? SHRINK_LOOK_MOBILE : SHRINK_LOOK;
  const unfurlCamera = mobile ? UNFURL_CAMERA_MOBILE : UNFURL_CAMERA;
  const unfurlLook = mobile ? UNFURL_LOOK_MOBILE : UNFURL_LOOK;

  const sceneSync = useSceneSync();
  sceneSync.camera = camera;

  const lenis = useLenis();
  const asymptoteDone = useState("asymptote-done", () => false);
  const skipIntro = reduced || asymptoteDone.value;

  if (skipIntro) {
    camera.position.copy(endCamera);
    lookTarget.copy(endLook);
  } else {
    camera.position.copy(START_CAMERA);
    lenis.stop();
  }
  camera.lookAt(lookTarget);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const shapes = buildShapes();
  const shapeArray: Float32Array[] = [
    shapes.flat,
    shapes.asymptote,
    shapes.sphere,
    shapes.wave,
  ];

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(shapes.flat.length);
  positions.set(shapes.flat);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  dotTexture = createCircleTexture();
  material = new THREE.PointsMaterial({
    color: DOT_COLOR,
    size: DOT_SIZE,
    map: dotTexture,
    transparent: true,
    alphaTest: 0.5,
    opacity: FINAL_DOT_OPACITY,
  });

  const dotPlane = new THREE.Points(geometry, material);
  scene.add(dotPlane);

  let sunMesh: THREE.Mesh | null = null;
  if (!isMobile.value) {
    sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    sunMaterial = new THREE.MeshBasicMaterial({
      color: "0xffffff",
      fog: false,
    });
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.scale.setScalar(0);
    sunMesh.position.set(0, 0, 0);
    scene.add(sunMesh);
  }

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (!isMobile.value) {
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD
    );
    composer.addPass(bloomPass);
  }

  const state = {
    morphPhase: 0,
    sunScale: 0,
    sunColorT: 0,
    sunOffsetT: 1,
    sunPositionT: 0,
    dotOpacity: FINAL_DOT_OPACITY,
    unfurlT: 0,
    waveActive: 0,
  };
  let waveStartTime = 0;
  let sphereSpin = 0;

  let cameraTweenStart: number | null = null;

  function buildScrollTimeline() {
    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "10% top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    scrollTimeline
      // asymptote to sphere
      .to(state, { morphPhase: 2, duration: 3 }, 0)
      // to sphere camera position
      .to(
        camera.position,
        {
          x: sphereCamera.x,
          y: sphereCamera.y,
          z: sphereCamera.z,
          duration: 3,
        },
        0
      )
      // tp sphere camera look at
      .to(
        lookTarget,
        {
          x: sphereLook.x,
          y: sphereLook.y,
          z: sphereLook.z,
          duration: 3,
        },
        0
      )
      // to sun camera position
      .to(
        camera.position,
        {
          x: shrinkCamera.x,
          y: shrinkCamera.y,
          z: shrinkCamera.z,
          duration: 3,
        },
        35
      )
      // to sun camera look at
      .to(
        lookTarget,
        {
          x: shrinkLook.x,
          y: shrinkLook.y,
          z: shrinkLook.z,
          duration: 3.0,
        },
        35
      )
      .to(state, { morphPhase: 3, duration: 3.0 }, 35)
      .to(state, { sunScale: 1, duration: 3.0 }, 37)
      .to(state, { sunPositionT: 1.0, duration: 30, ease: "none" }, 40)
      // sun fades fully out first
      .to(state, { sunScale: 0, duration: 3, ease: "power2.in" }, 70)
      // then the wave plane floats up from below into position
      .to(state, { morphPhase: 4, duration: 4 }, 73)
      .to(state, { unfurlT: 1, duration: 4, ease: "power2.out" }, 73)
      .to(
        camera.position,
        {
          x: unfurlCamera.x,
          y: unfurlCamera.y,
          z: unfurlCamera.z,
          duration: 4,
        },
        73
      )
      .to(
        lookTarget,
        {
          x: unfurlLook.x,
          y: unfurlLook.y,
          z: unfurlLook.z,
          duration: 4,
        },
        73
      )
      // wave kicks in once the plane has settled
      .to(state, { waveActive: 1, duration: 13 }, 77);
  }

  if (skipIntro) {
    faded.value = true;
    state.morphPhase = 1;
    asymptoteDone.value = true;
    buildScrollTimeline();
  } else {
    requestAnimationFrame(() => {
      faded.value = true;
    });
    setTimeout(() => {
      cameraTweenStart = performance.now();
      introTween = gsap.to(state, {
        morphPhase: 1,
        duration: ASYMPTOTE_INTRO_MS / 1000,
        delay: CAMERA_TWEEN_MS / 1000,
        ease: "power2.inOut",
        onComplete: () => {
          lenis.start();
          asymptoteDone.value = true;
          buildScrollTimeline();
        },
      });
    }, FADE_IN_MS);
  }

  function animate(time: number) {
    if (!reduced && cameraTweenStart !== null) {
      const elapsed = time - cameraTweenStart;
      const t = Math.min(1, elapsed / CAMERA_TWEEN_MS);
      const eased = easeInOutCubic(t);
      camera.position.lerpVectors(START_CAMERA, endCamera, eased);
      lookTarget.set(eased * endLook.x, eased * endLook.y, eased * endLook.z);
      if (t >= 1) {
        cameraTweenStart = null;
      }
    }
    camera.lookAt(lookTarget);

    const mp = state.morphPhase;
    const pos = (geometry!.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    if (mp < 2) {
      const lo = Math.floor(mp);
      const hi = lo + 1;
      const blend = mp - lo;
      const shapeA = shapeArray[lo]!;
      const shapeB = shapeArray[hi]!;
      for (let i = 0; i < pos.length; i++) {
        pos[i] = shapeA[i]! + (shapeB[i]! - shapeA[i]!) * blend;
      }
      dotPlane.position.set(0, 0, 0);
      dotPlane.scale.setScalar(1);
    } else if (mp < 3) {
      const sphereShape = shapeArray[2]!;
      pos.set(sphereShape);
      const shrinkT = Math.min(1, mp - 2);
      dotPlane.position.set(SUN_START_X * shrinkT, 0, 0);
      dotPlane.scale.setScalar(1 - shrinkT);
    } else {
      const waveShape = shapeArray[3]!;
      pos.set(waveShape);
      const u = state.unfurlT;
      dotPlane.position.set(
        UNFURL_TARGET.x,
        FLOAT_START_Y + (UNFURL_TARGET.y - FLOAT_START_Y) * u,
        UNFURL_TARGET.z
      );
      dotPlane.scale.setScalar(1);
      if (state.waveActive > 0) {
        if (waveStartTime === 0) waveStartTime = time;
        const elapsed = (time - waveStartTime) / 1000;
        const amp = WAVE_AMPLITUDE * state.waveActive;
        for (let i = 0; i < pos.length; i += 3) {
          const baseX = waveShape[i]!;
          const baseZ = waveShape[i + 2]!;
          pos[i + 1] =
            waveShape[i + 1]! +
            amp *
              (Math.sin(
                WAVE_FREQ_X * baseX + WAVE_SPEED_X * elapsed + WAVE_PHASE_X
              ) +
                Math.sin(
                  WAVE_FREQ_Z * baseZ + WAVE_SPEED_Z * elapsed + WAVE_PHASE_Z
                ));
        }
      } else {
        waveStartTime = 0;
      }
    }
    (geometry!.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    let rotation = 0;
    if (mp >= 2 && mp < 3) {
      if (!sceneSync.spinPaused) sphereSpin += SPHERE_SPIN_SPEED;
      rotation = sphereSpin;
    }
    dotPlane.rotation.y = rotation;
    sceneSync.sphereRotation = rotation;
    sceneSync.sphereCenter.set(dotPlane.position.x, 0, 0);
    material!.opacity = state.dotOpacity;

    if (sunMesh && bloomPass) {
      sunMesh.scale.setScalar(state.sunScale * SUN_MAX_SIZE);
      bloomPass.strength = state.sunScale * BLOOM_STRENGTH;

      const sunX =
        SUN_START_X * state.sunOffsetT +
        (SUN_END_X - SUN_START_X) * state.sunPositionT;
      const sunY = ARC_HEIGHT * Math.sin(state.sunPositionT * Math.PI);
      sunMesh.position.set(sunX, sunY, 0);

      sunProjVec.copy(sunMesh.position).project(camera);
      sceneSync.sunScreenX = (sunProjVec.x + 1) * 0.5 * window.innerWidth;
      sceneSync.sunScreenY = (-sunProjVec.y + 1) * 0.5 * window.innerHeight;
    }

    composer!.render();
    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  resizeHandler = () => {
    if (!renderer || !composer) return;
    width = window.innerWidth;
    height = window.innerHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    bloomPass?.setSize(width, height);
  };
  window.addEventListener("resize", resizeHandler);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  useSceneSync().camera = null;
  useLenis().start();
  if (introTween) {
    introTween.kill();
    introTween = null;
  }
  if (scrollTimeline) {
    scrollTimeline.scrollTrigger?.kill();
    scrollTimeline.kill();
    scrollTimeline = null;
  }
  geometry?.dispose();
  material?.dispose();
  dotTexture?.dispose();
  sunGeometry?.dispose();
  sunMaterial?.dispose();
  bloomPass?.dispose();
  composer?.dispose();
  if (renderer) {
    renderer.domElement.remove();
    renderer.dispose();
  }
});
</script>

<template>
  <div
    ref="canvasContainer"
    class="dot-background"
    :class="{ 'is-visible': faded }"
    aria-hidden="true"
  />
</template>

<style scoped>
.dot-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 600ms ease;
}

.dot-background.is-visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .dot-background {
    opacity: 1;
    transition: none;
  }
}
</style>
