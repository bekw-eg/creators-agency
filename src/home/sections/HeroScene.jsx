import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, MeshDistortMaterial } from '@react-three/drei';
import { MathUtils } from 'three';

/** Позиция мыши по всему окну в нормализованных координатах [-1..1]. */
function useWindowPointer(enabled) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);
  return pointer;
}

/** Жидкая хромированная форма + неоновое кольцо. Плавно следует за курсором. */
function ChromeBlob({ mobile, pointer }) {
  const group = useRef(null);
  const blob = useRef(null);
  const ring = useRef(null);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    blob.current.rotation.x += d * 0.1;
    blob.current.rotation.y += d * 0.16;
    ring.current.rotation.z += d * 0.25;

    if (!mobile) {
      const { x, y } = pointer.current;
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, x * 0.6, 2.5, d);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -y * 0.4, 2.5, d);
      group.current.position.x = MathUtils.damp(group.current.position.x, 1.5 + x * 0.25, 2, d);
      group.current.position.y = MathUtils.damp(group.current.position.y, y * 0.2, 2, d);
    }
  });

  return (
    <group ref={group} position={mobile ? [0, 0.55, 0] : [1.5, 0, 0]}>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={mobile ? 0.4 : 0.9}>
        <mesh ref={blob} scale={mobile ? 1.05 : 1.45}>
          <icosahedronGeometry args={[1, mobile ? 12 : 28]} />
          <MeshDistortMaterial
            color="#e9e9ef"
            metalness={1}
            roughness={0.08}
            distort={mobile ? 0.3 : 0.42}
            speed={1.4}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh ref={ring} rotation={[1.15, 0.2, 0]} scale={mobile ? 1.45 : 2.05}>
          <torusGeometry args={[1, 0.012, 16, mobile ? 96 : 180]} />
          <meshBasicMaterial color="#C6FF00" toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Hero 3D-сцена. Производительность:
 * - frameloop="never", когда секция вне экрана (ноль нагрузки на GPU);
 * - окружение (Lightformer) запекается один раз (frames=1), без загрузки HDR из сети;
 * - на мобильных: меньше полигонов, ниже DPR, без антиалиасинга и без трекинга мыши.
 */
export default function HeroScene({ active = true, mobile = false }) {
  const pointer = useWindowPointer(!mobile);

  return (
    <Canvas
      className="!pointer-events-none"
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 5.2], fov: 40 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
    >
      <ChromeBlob mobile={mobile} pointer={pointer} />
      <Environment resolution={mobile ? 64 : 256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="ring" color="#C6FF00" intensity={6} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={4} />
          <Lightformer form="rect" color="#7C5CFF" intensity={8} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 6, 1]} />
          <Lightformer form="rect" intensity={1.5} rotation-y={Math.PI} position={[0, 0, 10]} scale={[10, 2, 1]} />
        </group>
      </Environment>
    </Canvas>
  );
}
