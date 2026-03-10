"use client";

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

import { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { cn } from "@/libs/utils";

// Resuelve CSS variables (e.g. "var(--highlight-one)") al valor computado real
function resolveCSSColor(value: string): string {
  const match = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (match) {
    return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  }
  return value;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface STLFile {
  /** Filename shown in the list (without extension is fine) */
  name: string;
  /** URL path to the .stl file (must be publicly accessible) */
  path: string;
  /** Optional display label — falls back to `name` */
  label?: string;
}

interface STLViewerProps {
  files: STLFile[];
  /** Height of the main viewer in pixels. Default: 500 */
  height?: number;
  className?: string;
  /** CSS-compatible color for the main mesh. Default: #a3e635 */
  modelColor?: string;
  /** CSS-compatible color for the menu. Default: #a3e635 */
  menuColor?: string;
}

// ─── Mini Preview (memoised — only re-mounts when path changes) ──────────────

const STLPreview = memo(({ path }: { path: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const SIZE = 80;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(1, 2, 2);
    scene.add(dir);

    let mesh: THREE.Mesh | null = null;

    const loader = new STLLoader();
    loader.load(path, (geometry) => {
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      const material = new THREE.MeshPhongMaterial({
        color: 0x6b7280,
        shininess: 40,
        specular: 0x222222,
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(-center.x, -center.y, -center.z);
      scene.add(mesh);

      camera.position.set(maxDim * 1.2, maxDim * 0.8, maxDim * 1.8);
      camera.near = maxDim * 0.001;
      camera.far = maxDim * 100;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      // Render once — no animation loop needed for static previews
      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
      if (mesh) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    };
  }, [path]);

  return <canvas ref={canvasRef} style={{ width: 80, height: 80, display: "block" }} />;
});
STLPreview.displayName = "STLPreview";

// ─── Main Viewer ──────────────────────────────────────────────────────────────

export default function STLViewer({
  files,
  height = 500,
  className,
  modelColor = "var(--highlight-one)",
  menuColor = "var(--highlight-one)",
}: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<TrackballControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animFrameRef = useRef<number>(0);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFile = files[selectedIndex];

  // ── Initialise Three.js once ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, w / height, 0.1, 100000);
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dir1.position.set(1, 2, 3);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dir2.position.set(-2, -1, -2);
    scene.add(dir2);

    // TrackballControls: rotación libre 360° sin bloqueo de polos
    const controls = new TrackballControls(camera, canvas);
    controls.rotateSpeed = 4.0;
    controls.zoomSpeed = 1.5;
    controls.panSpeed = 0.8;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.15;
    controls.minDistance = 0.01;
    controls.maxDistance = 100000;

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const handleResize = () => {
      const w2 = container.clientWidth;
      renderer.setSize(w2, height);
      camera.aspect = w2 / height;
      camera.updateProjectionMatrix();
      controls.handleResize();
    };
    window.addEventListener("resize", handleResize);

    // Animation loop — TrackballControls requiere update() cada frame
    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // ── Load STL when selection changes ──────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls || !selectedFile) return;

    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
      meshRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    const loader = new STLLoader();
    loader.load(
      selectedFile.path,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();

        const box = geometry.boundingBox!;
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(resolveCSSColor(modelColor)),
          shininess: 60,
          specular: new THREE.Color(0x333333),
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-center.x, -center.y, -center.z);
        scene.add(mesh);
        meshRef.current = mesh;

        const dist = maxDim * 2.2;
        camera.position.set(dist * 0.6, dist * 0.4, dist);
        camera.near = maxDim * 0.0001;
        camera.far = maxDim * 1000;
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, 0);
        controls.update();

        setIsLoading(false);
      },
      undefined,
      () => {
        setError(`No se pudo cargar: ${selectedFile.name}`);
        setIsLoading(false);
      },
    );
  }, [selectedIndex, selectedFile, modelColor]);

  // ── Zoom in/out along camera→target axis ─────────────────────────────────
  const zoom = useCallback((factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
    const dist = camera.position.distanceTo(controls.target);
    camera.position.addScaledVector(dir, dist * factor);
    controls.update();
  }, []);

  // ── Rotar cámara con quaterniones (funciona con TrackballControls sin bloqueo) ─
  const rotate = useCallback((deltaTheta: number, deltaPhi: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const target = controls.target;
    const offset = new THREE.Vector3().subVectors(camera.position, target);

    // Horizontal: rotar alrededor del eje UP actual de la cámara
    if (deltaTheta !== 0) {
      const q = new THREE.Quaternion().setFromAxisAngle(camera.up.clone().normalize(), -deltaTheta);
      offset.applyQuaternion(q);
      camera.up.applyQuaternion(q);
    }

    // Vertical: rotar alrededor del eje RIGHT actual de la cámara
    if (deltaPhi !== 0) {
      const viewDir = offset.clone().normalize().negate();
      const right = new THREE.Vector3().crossVectors(viewDir, camera.up).normalize();
      const q = new THREE.Quaternion().setFromAxisAngle(right, -deltaPhi);
      offset.applyQuaternion(q);
      camera.up.applyQuaternion(q);
    }

    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    controls.update();
  }, []);

  // ── Reset camera to fit the current model ────────────────────────────────
  const resetCamera = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const mesh = meshRef.current;
    if (!camera || !controls || !mesh) return;

    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox!;
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim * 2.2;

    camera.position.set(dist * 0.6, dist * 0.4, dist);
    camera.up.set(0, 1, 0); // Restablecer orientación tras rotación libre
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!files || files.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-[var(--border-dim-one)] p-8"
        style={{ color: "var(--foreground-muted)" }}
      >
        No hay archivos STL para mostrar.
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {/* ── Toolbar: full width, above sidebar + canvas ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-semibold truncate" style={{ color: "var(--foreground-color)" }}>
          {selectedFile?.label ?? selectedFile?.name}
        </span>

        <div className="flex items-center gap-2">
          {/* Rotación horizontal ← → */}
          <div className="flex items-center rounded-lg border border-[var(--border-dim-one)] overflow-hidden">
            <button
              onClick={() => rotate(Math.PI / 12, 0)}
              className="px-3 py-1.5 text-sm transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Rotar izquierda"
            >
              ←
            </button>
            <span className="w-px self-stretch" style={{ backgroundColor: "var(--border-dim-one)" }} />
            <button
              onClick={() => rotate(-Math.PI / 12, 0)}
              className="px-3 py-1.5 text-sm transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Rotar derecha"
            >
              →
            </button>
          </div>

          {/* Rotación vertical ↑ ↓ */}
          <div className="flex items-center rounded-lg border border-[var(--border-dim-one)] overflow-hidden">
            <button
              onClick={() => rotate(0, Math.PI / 12)}
              className="px-3 py-1.5 text-sm transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Rotar arriba"
            >
              ↑
            </button>
            <span className="w-px self-stretch" style={{ backgroundColor: "var(--border-dim-one)" }} />
            <button
              onClick={() => rotate(0, -Math.PI / 12)}
              className="px-3 py-1.5 text-sm transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Rotar abajo"
            >
              ↓
            </button>
          </div>

          {/* Zoom + − */}
          <div className="flex items-center rounded-lg border border-[var(--border-dim-one)] overflow-hidden">
            <button
              onClick={() => zoom(0.25)}
              className="px-3 py-1.5 text-sm font-bold transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Acercar"
            >
              +
            </button>
            <span className="w-px self-stretch" style={{ backgroundColor: "var(--border-dim-one)" }} />
            <button
              onClick={() => zoom(-0.25)}
              className="px-3 py-1.5 text-sm font-bold transition-all hover:bg-[var(--card-background)]"
              style={{ color: "var(--foreground-muted)" }}
              title="Alejar"
            >
              −
            </button>
          </div>

          <button
            onClick={resetCamera}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-dim-one)] transition-all hover:border-[var(--border-highlight-one)]"
            style={{ color: "var(--foreground-muted)" }}
          >
            ⊙ Reset
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + canvas, exact same height ── */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Sidebar */}
        <aside
          className="stl-scroll flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto shrink-0 rounded-xl pb-1 md:pb-0"
          style={{
            height,
          }}
        >
          {files.map((file, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedIndex(i)}
                title={file.label ?? file.name}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer shrink-0",
                  isSelected ? "bg-[var(--card-background)]" : "bg-transparent hover:bg-[var(--card-background)]",
                )}
                style={{
                  width: 100,
                  borderColor: isSelected ? menuColor : "var(--border-dim-one)",
                }}
              >
                <div className="rounded-lg overflow-hidden" style={{ width: 80, height: 80 }}>
                  <STLPreview path={file.path} />
                </div>
                <span
                  className="text-xs font-medium w-full text-center truncate"
                  style={{
                    color: isSelected ? `${menuColor}` : "var(--foreground-muted)",
                  }}
                >
                  {file.label ?? file.name}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Canvas wrapper — same height as sidebar */}
        <div
          ref={containerRef}
          className="flex-1 relative rounded-xl overflow-hidden border border-[var(--border-dim-one)]"
          style={{ height }}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Loading overlay */}
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "color-mix(in srgb, var(--card-background) 85%, transparent)" }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--highlight-two) transparent var(--highlight-two) var(--highlight-two)" }}
                />
                <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                  Cargando modelo…
                </span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-red-400 bg-black/50 px-4 py-2 rounded-lg">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
