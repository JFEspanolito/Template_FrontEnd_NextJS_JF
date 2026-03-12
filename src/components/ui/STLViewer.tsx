"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// CAMBIO 1: Importar el control correcto
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cn } from "@/libs/utils";

function resolveCSSColor(value: string): string {
  const match = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (match) {
    return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  }
  return value;
}

export interface STLFile {
  name: string;
  path: string;
  label?: string;
}

interface STLViewerProps {
  files: STLFile[];
  height?: number;
  className?: string;
  modelColor?: string;
  menuColor?: string;
}

// ─── Mini Preview ─────────────────────────────────────────────────────────────
const STLPreview = memo(({ path }: { path: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(80, 80);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    new STLLoader().load(path, (geometry) => {
      const material = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
      const mesh = new THREE.Mesh(geometry, material);
      geometry.computeBoundingSphere();
      mesh.position.sub(geometry.boundingSphere!.center);
      scene.add(mesh);
      camera.position.set(geometry.boundingSphere!.radius * 2, 0, 0);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    });
    return () => renderer.dispose();
  }, [path]);
  return <canvas ref={canvasRef} className="w-20 h-20 block rounded-lg" />;
});
STLPreview.displayName = "STLPreview";

// ─── Main Viewer ──────────────────────────────────────────────────────────────
export default function STLViewer({
  files,
  height = 500,
  className,
  modelColor = "var(--highlight-two)",
  menuColor = "var(--highlight-two)",
}: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  // CAMBIO 2: Tipo de Ref actualizado a OrbitControls
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // --- CLÁUSULA DE GUARDIA ---
  if (!files || files.length === 0) {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--border-dim-one)] rounded-2xl bg-[var(--card-background)] opacity-60", className)}
        style={{ height }}
      >
        <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
          System Alert: No STL assets detected in hangar
        </span>
      </div>
    );
  }

  // ── Lógica de Control (Reparada para OrbitControls) ──
  const zoom = useCallback((factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const distance = camera.position.distanceTo(controls.target);
    const newDistance = distance - distance * factor;
    const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();

    camera.position.copy(controls.target).addScaledVector(direction, newDistance);
    controls.update();
  }, []);

  const rotate = useCallback((deltaTheta: number, deltaPhi: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    spherical.theta += deltaTheta;
    spherical.phi += deltaPhi;
    // Restringir para evitar "gimbal lock" o volteos raros
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
  }, []);

  const resetCamera = useCallback(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const mesh = meshRef.current;
    if (!controls || !camera || !mesh) return;

    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere!.radius;
    const dist = radius * 2.2;

    camera.position.set(dist, dist / 2, dist);
    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  // ── Init Engine ──
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(w, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / height, 0.1, 10000);

    // CAMBIO 3: Instanciar OrbitControls con Damping (Inercia)
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Este es el secreto de la fluidez
    controls.rotateSpeed = 0.7;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Necesario para el damping
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      controls.dispose();
    };
  }, [height]);

  // ── Load Model (Igual que antes) ──
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !files[selectedIndex]) return;
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
    }
    setIsLoading(true);
    new STLLoader().load(files[selectedIndex].path, (geometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(resolveCSSColor(modelColor)),
        shininess: 90,
      });
      const mesh = new THREE.Mesh(geometry, material);
      geometry.computeBoundingSphere();
      mesh.position.sub(geometry.boundingSphere!.center);
      scene.add(mesh);
      meshRef.current = mesh;
      resetCamera();
      setIsLoading(false);
    });
  }, [selectedIndex, files, modelColor, resetCamera]);

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-display font-bold text-[var(--foreground-color)]">
          {files[selectedIndex].label || files[selectedIndex].name}
        </h2>
        <div className="flex items-center gap-2 bg-[var(--btn-secondary)] p-1 rounded-lg border border-[var(--border-dim-one)]">
          <button onClick={() => rotate(Math.PI / 12, 0)} className="p-2 hover:text-[var(--highlight-two)]">
            ←
          </button>
          <button onClick={() => rotate(-Math.PI / 12, 0)} className="p-2 hover:text-[var(--highlight-two)]">
            →
          </button>
          <div className="w-px h-4 bg-[var(--border-dim-one)]" />
          <button onClick={() => rotate(0, Math.PI / 12)} className="p-2 hover:text-[var(--highlight-two)]">
            ↑
          </button>
          <button onClick={() => rotate(0, -Math.PI / 12)} className="p-2 hover:text-[var(--highlight-two)]">
            ↓
          </button>
          <div className="w-px h-4 bg-[var(--border-dim-one)]" />
          <button onClick={() => zoom(0.15)} className="p-2 hover:text-[var(--highlight-two)]">
            +
          </button>
          <button onClick={() => zoom(-0.15)} className="p-2 hover:text-[var(--highlight-two)]">
            −
          </button>
          <button
            onClick={resetCamera}
            className="ml-2 px-3 py-1 text-xs font-bold border rounded-md border-[var(--border-dim-one)] hover:border-[var(--highlight-two)] text-[var(--foreground-color)]"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <aside
          className="flex md:flex-col gap-3 overflow-auto p-2 rounded-xl border border-[var(--border-dim-one)] scrollbar-stark"
          style={{ height, minWidth: "120px" }}
        >
          {files.map((file, i) => (
            <button
              key={file.path}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "p-2 rounded-xl border transition-all shrink-0 flex flex-col items-center gap-2",
                i === selectedIndex
                  ? "bg-[var(--card-background)] border-[var(--highlight-two)] shadow-soft"
                  : "border-transparent opacity-50 hover:opacity-100",
              )}
            >
              <STLPreview path={file.path} />
              <span
                className="text-[10px] uppercase font-bold tracking-tighter truncate w-20"
                style={{ color: i === selectedIndex ? "var(--highlight-two)" : "inherit" }}
              >
                {file.name}
              </span>
            </button>
          ))}
        </aside>
        <div
          ref={containerRef}
          className="flex-1 bg-[var(--card-background)] rounded-2xl border border-[var(--border-dim-one)] relative overflow-hidden"
          style={{ height }}
        >
          <canvas ref={canvasRef} className="w-full h-full block cursor-move" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-[var(--highlight-two)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * STLViewer — React island component for viewing STL 3D models.
 *
 * Usage in Astro page:
 * ---
 * import STLViewer, { type STLFile } from "@/components/ui/STLViewer";
 *
 * // Required packages:
 * // pnpm add three
 * // pnpm add -D @types/three
 *
 * // Vite resolves STL files in src/assets/STLS/ to hashed public URLs
 * const stlModules = import.meta.glob('/src/assets/STLS/*.stl', {
 *   eager: true,
 *   query: '?url',
 *   import: 'default',
 * });
 * const files: STLFile[] = Object.entries(stlModules).map(([filePath, url]) => ({
 *   name: filePath.split('/').pop()!.replace('.stl', ''),
 *   path: url as string,
 * }));
 * ---
 * <STLViewer client:only="react" files={files} height={500} />
 *
 * Alternatively, place STL files in public/stls/ and pass paths manually:
 * <STLViewer client:only="react" files={[{ name: "model", path: "/stls/model.stl" }]} />
 */
