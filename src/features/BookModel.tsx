import { Canvas } from '@react-three/fiber'
import { RoundedBox, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Book() {
  return (
    <group position={[0, -0.2, 0]} rotation={[0, Math.PI / 8, 0]}>
      {/* Leather cover */}
      <RoundedBox
        args={[2.2, 3.2, 0.5]} // width, height, depth
        radius={0.12}
        smoothness={6}
      >
        <meshStandardMaterial
          color="#4b2e2b"
          roughness={0.85}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Spine highlight */}
      <RoundedBox
        args={[0.25, 3.1, 0.52]}
        radius={0.1}
        smoothness={6}
        position={[-1.1, 0, 0]}
      >
        <meshStandardMaterial
          color="#3b1f1a"
          roughness={0.9}
        />
      </RoundedBox>

      {/* Pages */}
      {Array.from({ length: 18 }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[1.9, 3.0, 0.01]}
          radius={0.02}
          smoothness={2}
          position={[0.05, 0, -0.23 + i * 0.012]}
        >
          <meshStandardMaterial
            color="#f9fafb"
            roughness={0.6}
          />
        </RoundedBox>
      ))}
    </group>
  )
}

export function BookModel3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 40 }}
      className="w-full h-full"
    >
      {/* Soft studio lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 2, 2]} intensity={0.6} />

      <Book />

      {/* Locked orbit — feels premium */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 2.3}
      />

      <Environment preset="studio" />
    </Canvas>
  )
}
