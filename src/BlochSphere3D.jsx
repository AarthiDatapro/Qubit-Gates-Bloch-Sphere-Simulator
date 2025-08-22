import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

function sphericalToCartesian(theta, phi, radius = 1) {
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return [x, y, z];
}

function buildMeridianPoints(phiFixed, segments = 64) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI; // theta: 0..pi
    const [x, y, z] = sphericalToCartesian(t, phiFixed, 1);
    pts.push([x, y, z]);
  }
  return pts;
}

function buildParallelPoints(thetaFixed, segments = 96) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const p = (i / segments) * Math.PI * 2; // phi: 0..2pi
    const [x, y, z] = sphericalToCartesian(thetaFixed, p, 1);
    pts.push([x, y, z]);
  }
  return pts;
}

function Arrow({ to, color = "#4f46e5" }) {
  const origin = [0, 0, 0];
  const headLength = 0.12;
  const headRadius = 0.04;

  const dir = useMemo(() => {
    const [x, y, z] = to;
    const len = Math.hypot(x, y, z) || 1;
    return [x / len, y / len, z / len];
  }, [to]);

  const headPos = useMemo(() => {
    const [dx, dy, dz] = dir;
    const [tx, ty, tz] = to;
    return [tx - dx * (headLength * 0.5), ty - dy * (headLength * 0.5), tz - dz * (headLength * 0.5)];
  }, [dir, to]);

  const quaternion = useMemo(() => {
    // Rotate cone (default +Y) to align with dir vector
    const [dx, dy, dz] = dir;
    const u = [0, 1, 0];
    const v = [dx, dy, dz];
    const uxv = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const w = Math.sqrt((1 + Math.max(-1, Math.min(1, dot))) * 2);
    if (w < 1e-6) return [0, 0, 0, 1];
    return [uxv[0] / w, uxv[1] / w, uxv[2] / w, w * 0.5];
  }, [dir]);

  return (
    <group>
      <Line points={[origin, to]} color={color} lineWidth={3} />
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[headRadius, headLength, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function BlochSphere3D({ theta, phi, vector }) {
  const tip = useMemo(() => {
    if (vector && Array.isArray(vector)) {
      const [x, y, z] = vector;
      const len = Math.hypot(x, y, z) || 1;
      const scale = Math.min(0.98, len);
      return [x * (scale / len), y * (scale / len), z * (scale / len)];
    }
    return sphericalToCartesian(theta || 0, phi || 0, 0.98);
  }, [theta, phi, vector]);

  const meridianAngles = useMemo(() => [0, 30, 60, 90, 120, 150].map((d) => (d * Math.PI) / 180), []);
  const parallelAngles = useMemo(() => [-60, -30, 0, 30, 60].map((d) => ((90 - d) * Math.PI) / 180), []);

  return (
    <Canvas camera={{ position: [2.2, 2.2, 2.2], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />

      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.2} />
      </mesh>

      {meridianAngles.map((a, i) => (
        <Line key={`mer-${i}`} points={buildMeridianPoints(a)} color="#64748b" lineWidth={1} opacity={0.45} transparent />
      ))}

      {parallelAngles.map((t, i) => (
        <Line key={`par-${i}`} points={buildParallelPoints(t)} color="#94a3b8" lineWidth={1} opacity={0.35} transparent />
      ))}

      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#ef4444" lineWidth={1.5} />
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#10b981" lineWidth={1.5} />
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#3b82f6" lineWidth={1.5} />

      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      <Arrow to={tip} />

      <OrbitControls enablePan={false} enableDamping dampingFactor={0.1} minDistance={1.6} maxDistance={4} />
    </Canvas>
  );
}


