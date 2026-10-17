import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PixelEarthIntroProps = {
  onComplete: () => void;
};

const INTRO_RELEASE = "pixel-earth-v2-2026-10-17";

const DURATION = 7000;

const smoothstep = (start: number, end: number, value: number) => {
  const x = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
};

const makePixelTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#ffffff";
    context.fillRect(1, 1, 6, 6);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
};

const isLand = (latitude: number, longitude: number) => {
  const blobs = [
    [45, -105, 31, 24], [16, -85, 17, 13], [-16, -61, 20, 34],
    [49, 18, 23, 17], [8, 22, 24, 32], [47, 75, 48, 25],
    [17, 101, 22, 18], [-25, 134, 25, 17], [67, -42, 13, 11],
    [36, 138, 9, 13], [-42, 173, 5, 8]
  ];

  return blobs.some(([centerLat, centerLon, width, height]) => {
    const lonDistance = Math.min(Math.abs(longitude - centerLon), 360 - Math.abs(longitude - centerLon));
    const x = lonDistance / width;
    const y = (latitude - centerLat) / height;
    const edgeNoise = Math.sin(latitude * 0.31 + longitude * 0.17) * 0.09;
    return x * x + y * y < 1 + edgeNoise;
  });
};

const buildPixelContinents = (radius: number, density: number) => {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();

  for (let latitude = -78; latitude <= 78; latitude += density) {
    for (let longitude = -180; longitude < 180; longitude += density) {
      if (!isLand(latitude, longitude)) continue;
      const lat = THREE.MathUtils.degToRad(latitude);
      const lon = THREE.MathUtils.degToRad(longitude);
      const pixelRadius = radius + 0.018 + Math.sin(latitude * longitude) * 0.004;
      positions.push(
        pixelRadius * Math.cos(lat) * Math.sin(lon),
        pixelRadius * Math.sin(lat),
        pixelRadius * Math.cos(lat) * Math.cos(lon)
      );
      const shade = 0.48 + (latitude + 78) / 400 + Math.random() * 0.16;
      color.setRGB(shade, shade, shade + 0.025);
      colors.push(color.r, color.g, color.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: density <= 3 ? 0.065 : 0.085,
    map: makePixelTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    alphaTest: 0.25,
    depthWrite: true,
    sizeAttenuation: true
  });
  return new THREE.Points(geometry, material);
};

const buildDoor = (radius: number, lowPower: boolean) => {
  const group = new THREE.Group();
  group.name = "voxel-portal";
  // At the front pole +Z is the surface normal, so the portal remains attached
  // to the earth while inheriting its complete local transform.
  group.position.set(0, -0.02, radius - 0.02);

  const stone = new THREE.MeshStandardMaterial({ color: 0x24272b, roughness: 0.78, metalness: 0.2 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x777d84, roughness: 0.5, metalness: 0.42 });
  const inset = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.88, metalness: 0.08 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.68, metalness: 0.3 });
  const gold = new THREE.MeshBasicMaterial({
    color: 0xffc766,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const seamGold = gold.clone();

  const addBox = (
    parent: THREE.Object3D,
    size: [number, number, number],
    position: [number, number, number],
    material: THREE.Material,
    castShadow = true
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Stepped voxel foundations bridge the globe's curved surface to the flat portal.
  const baseY = -0.92;
  [-0.72, -0.48, -0.24, 0, 0.24, 0.48, 0.72].forEach((x, index) => {
    const surfaceZ = Math.sqrt(Math.max(0, radius * radius - x * x - baseY * baseY)) - radius;
    addBox(group, [0.23, 0.18, 0.34], [x, baseY, surfaceZ + 0.13], index % 2 ? stone : edge);
  });
  addBox(group, [1.9, 0.16, 0.5], [0, -0.78, 0.18], stone);
  addBox(group, [1.62, 0.12, 0.62], [0, -0.66, 0.28], edge);

  // A recessed vestibule provides real depth behind the leaves.
  addBox(group, [1.36, 1.42, 0.48], [0, 0.04, 0.12], inset, false);
  const portalCore = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 1.28), gold);
  portalCore.position.set(0, 0.04, 0.385);
  group.add(portalCore);

  [-0.82, 0.82].forEach((x) => {
    addBox(group, [0.28, 1.78, 0.58], [x, 0.04, 0.38], stone);
    [-0.5, 0, 0.5].forEach((y, index) => {
      addBox(group, [0.34, 0.22, 0.66], [x, y, 0.42], index % 2 ? edge : stone);
    });
  });
  addBox(group, [1.92, 0.3, 0.62], [0, 0.92, 0.4], stone);
  [-0.66, -0.33, 0, 0.33, 0.66].forEach((x, index) => {
    addBox(group, [0.22, 0.18, 0.7], [x, 1.08, 0.43 + (index % 2) * 0.045], index % 2 ? stone : edge);
  });

  const contactShadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.08, lowPower ? 20 : 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false })
  );
  contactShadow.scale.set(1, 0.38, 1);
  contactShadow.position.set(0, -0.86, -0.025);
  contactShadow.rotation.x = -Math.PI / 2;
  group.add(contactShadow);

  // The outer door edges are the hinges. The free edges swing into the
  // raised vestibule without intersecting the globe.
  const leftPivot = new THREE.Group();
  const rightPivot = new THREE.Group();
  leftPivot.position.set(-0.66, 0.04, 0.7);
  rightPivot.position.set(0.66, 0.04, 0.7);
  const leftDoor = addBox(leftPivot, [0.65, 1.34, 0.16], [0.325, 0, 0], doorMaterial);
  const rightDoor = addBox(rightPivot, [0.65, 1.34, 0.16], [-0.325, 0, 0], doorMaterial);

  [leftDoor, rightDoor].forEach((leaf, leafIndex) => {
    [-0.44, 0, 0.44].forEach((y) => {
      addBox(leaf, [0.2, 0.16, 0.06], [leafIndex ? -0.16 : 0.16, y, 0.1], edge, false);
    });
  });
  group.add(leftPivot, rightPivot);

  const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.028, 1.3), seamGold);
  seam.position.set(0, 0.04, 0.795);
  group.add(seam);

  const portalLight = new THREE.PointLight(0xffbd55, 0, lowPower ? 7 : 10, 1.7);
  portalLight.position.set(0, 0.06, 1.16);
  group.add(portalLight);

  return { group, leftPivot, rightPivot, seam, portalCore, gold, seamGold, portalLight };
};

export default function PixelEarthIntro({ onComplete }: PixelEarthIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [fallback, setFallback] = useState(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsLeaving(true);
    window.setTimeout(onComplete, 520);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const timer = window.setTimeout(finish, 450);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      const timer = window.setTimeout(finish, 1200);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const lowPower = window.innerWidth < 720 || (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x030405, 1);
    renderer.shadowMap.enabled = !lowPower;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    mount.appendChild(renderer.domElement);
    const safetyTimer = window.setTimeout(finish, DURATION + 600);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030405, 0.055);
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.03, 50);
    camera.position.set(0, 0.12, camera.aspect < 0.72 ? 10.2 : 8.2);

    const earth = new THREE.Group();
    earth.rotation.set(-0.12, -2.35, -0.04);
    scene.add(earth);

    const radius = 2;
    const depthOccluder = new THREE.Mesh(
      new THREE.SphereGeometry(radius, lowPower ? 40 : 64, lowPower ? 28 : 44),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, depthTest: true })
    );
    depthOccluder.renderOrder = -1;
    earth.add(depthOccluder);

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius, lowPower ? 48 : 80, lowPower ? 32 : 56),
      new THREE.MeshPhysicalMaterial({
        color: 0x9aa0a6,
        transparent: true,
        opacity: 0.16,
        roughness: 0.18,
        metalness: 0.24,
        transmission: lowPower ? 0 : 0.35,
        thickness: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    shell.renderOrder = 2;
    earth.add(shell);

    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(radius + 0.025, 28, 18)),
      new THREE.LineBasicMaterial({ color: 0x7d848c, transparent: true, opacity: 0.13 })
    );
    earth.add(wireframe);
    earth.add(buildPixelContinents(radius, lowPower ? 5 : 3));

    const { group: door, leftPivot, rightPivot, seamGold, gold, portalLight } = buildDoor(radius, lowPower);
    earth.add(door);

    const ambient = new THREE.HemisphereLight(0xdde5ef, 0x050607, 1.6);
    const rim = new THREE.DirectionalLight(0xffffff, 3.2);
    rim.position.set(-4, 4, 5);
    const side = new THREE.DirectionalLight(0x8a929c, 1.2);
    side.position.set(4, -2, 2);
    scene.add(ambient, rim, side);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 128;
        const context = canvas.getContext("2d")!;
        const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
        gradient.addColorStop(0, "rgba(255,222,155,.96)");
        gradient.addColorStop(0.2, "rgba(240,169,62,.72)");
        gradient.addColorStop(1, "rgba(255,150,30,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
      })(),
      color: 0xffc56b,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    }));
    glow.position.set(0, 0.04, 2.78);
    glow.scale.set(0.25, 1.6, 1);
    earth.add(glow);

    const clock = new THREE.Clock();
    let frameId = 0;
    let contextLost = false;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setFallback(true);
      finish();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const ms = elapsed * 1000;
      const reveal = smoothstep(0, 800, ms);
      const align = smoothstep(700, 3400, ms);
      const push = smoothstep(3500, 6200, ms);
      const light = smoothstep(4850, 6400, ms);
      const open = smoothstep(5350, 6500, ms);

      earth.visible = reveal > 0.01;
      earth.scale.setScalar(0.82 + reveal * 0.18);
      earth.rotation.y = THREE.MathUtils.lerp(-2.35, 0, align);
      earth.rotation.x = THREE.MathUtils.lerp(-0.12, -0.035, align);
      earth.rotation.z = Math.sin(elapsed * 0.35) * 0.025 * (1 - align);

      const portrait = camera.aspect < 0.72;
      camera.position.z = THREE.MathUtils.lerp(portrait ? 10.2 : 8.2, portrait ? 2.08 : 1.72, push);
      camera.position.y = THREE.MathUtils.lerp(0.12, -0.03, push);
      camera.fov = THREE.MathUtils.lerp(42, 49, push);
      camera.updateProjectionMatrix();
      camera.lookAt(0, -0.03, 0);

      leftPivot.rotation.y = open * THREE.MathUtils.degToRad(88);
      rightPivot.rotation.y = -open * THREE.MathUtils.degToRad(88);
      seamGold.opacity = light * (1 - open * 0.72);
      gold.opacity = light * (0.12 + open * 0.88);
      (glow.material as THREE.SpriteMaterial).opacity = light * 0.7;
      glow.scale.set(0.25 + light * 3.3, 1.4 + light * 3.8, 1);
      portalLight.intensity = light * (lowPower ? 10 : 16);
      shell.material.opacity = 0.09 + reveal * 0.07;

      renderer.render(scene, camera);
      if (ms >= DURATION) finish();
      else if (!contextLost && !completedRef.current) frameId = requestAnimationFrame(render);
    };

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(safetyTimer);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            const map = (material as THREE.Material & { map?: THREE.Texture }).map;
            map?.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={`pixel-earth-intro ${isLeaving ? "is-leaving" : ""}`}
      data-intro-release={INTRO_RELEASE}
      role="dialog"
      aria-label="Website opening animation"
      aria-modal="true"
    >
      <div ref={mountRef} className="pixel-earth-canvas" aria-hidden="true" />
      <div className="pixel-earth-vignette" aria-hidden="true" />
      <div className="pixel-earth-grain" aria-hidden="true" />
      <div className="pixel-earth-gold-transition" aria-hidden="true" />
      {fallback && <div className="pixel-earth-fallback" aria-hidden="true"><span /></div>}
      <div className="pixel-earth-copy" aria-hidden="true">
        <span>BRIAN &amp; CODE</span>
        <strong>BEYOND THE SURFACE</strong>
      </div>
      <button type="button" className="pixel-earth-skip" onClick={finish} autoFocus>
        略過動畫 <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
