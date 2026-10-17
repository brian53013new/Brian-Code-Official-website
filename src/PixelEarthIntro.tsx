import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PixelEarthIntroProps = {
  onComplete: () => void;
};

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

const buildDoor = () => {
  const group = new THREE.Group();
  group.name = "door-relief";
  group.position.set(0, -0.08, 2.03);

  const stone = new THREE.MeshStandardMaterial({ color: 0x292b2e, roughness: 0.72, metalness: 0.34 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x777b80, roughness: 0.48, metalness: 0.52 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.64, metalness: 0.28 });
  const gold = new THREE.MeshBasicMaterial({ color: 0xffc65c, transparent: true, opacity: 0 });

  const frameParts = [
    [-0.72, 0, 0.12, 0.18, 1.5, 0.3], [0.72, 0, 0.12, 0.18, 1.5, 0.3],
    [0, 0.72, 0.12, 1.62, 0.2, 0.3], [0, -0.74, 0.12, 1.68, 0.16, 0.34]
  ];
  frameParts.forEach(([x, y, z, width, height, depth], index) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), index === 2 ? edge : stone);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  const leftPivot = new THREE.Group();
  const rightPivot = new THREE.Group();
  leftPivot.position.set(-0.04, 0, 0.15);
  rightPivot.position.set(0.04, 0, 0.15);
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(0.63, 1.3, 0.13), doorMaterial);
  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(0.63, 1.3, 0.13), doorMaterial);
  leftDoor.position.x = -0.315;
  rightDoor.position.x = 0.315;
  leftDoor.castShadow = rightDoor.castShadow = true;
  leftPivot.add(leftDoor);
  rightPivot.add(rightDoor);
  group.add(leftPivot, rightPivot);

  const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 1.28), gold);
  seam.position.set(0, 0, 0.225);
  group.add(seam);

  const lintelPixels = [-0.56, -0.28, 0, 0.28, 0.56];
  lintelPixels.forEach((x, index) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.16), index % 2 ? stone : edge);
    block.position.set(x, 0.91, 0.15 + (index % 2) * 0.04);
    group.add(block);
  });

  return { group, leftPivot, rightPivot, seam, gold };
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

    const { group: door, leftPivot, rightPivot, seam, gold } = buildDoor();
    earth.add(door);

    const ambient = new THREE.HemisphereLight(0xdde5ef, 0x050607, 1.6);
    const rim = new THREE.DirectionalLight(0xffffff, 3.2);
    rim.position.set(-4, 4, 5);
    const side = new THREE.DirectionalLight(0x8a929c, 1.2);
    side.position.set(4, -2, 2);
    const portalLight = new THREE.PointLight(0xffbd55, 0, 12, 1.5);
    portalLight.position.set(0, 0, 2.8);
    scene.add(ambient, rim, side, portalLight);

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
    glow.position.set(0, 0, 2.28);
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
      camera.position.z = THREE.MathUtils.lerp(portrait ? 10.2 : 8.2, portrait ? 3.72 : 2.62, push);
      camera.position.y = THREE.MathUtils.lerp(0.12, -0.03, push);
      camera.fov = THREE.MathUtils.lerp(42, 49, push);
      camera.updateProjectionMatrix();
      camera.lookAt(0, -0.03, 0);

      leftPivot.rotation.y = -open * 1.08;
      rightPivot.rotation.y = open * 1.08;
      gold.opacity = light;
      seam.scale.x = 1 + open * 9;
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
    <div className={`pixel-earth-intro ${isLeaving ? "is-leaving" : ""}`} role="dialog" aria-label="Website opening animation" aria-modal="true">
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
