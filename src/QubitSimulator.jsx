import React, { useMemo, useState } from "react";
import { animate } from "framer-motion";
import { Copy } from "lucide-react";
import BlochSphere3D from "./BlochSphere3D";
import Navbar from "./components/Navbar";
import GateMatrix from "./components/GateMatrix";
import AboutPage from "./components/AboutPage";
import GatesPage from "./components/GatesPage";
import ResizableLayout from "./components/ResizableLayout";
import "./App.css";

// -------------------------------------------------------------
// Interactive Qubit Bloch Sphere – single-file React component
// - Visualizes a Bloch sphere using SVG (orthographic projection)
// - Lets you set (theta, phi), shows the state vector
// - "Apply X" animates a rotation by π around the x-axis
// - Shows an IBM Quantum Composer–style code snippet (Qiskit)
// -------------------------------------------------------------

const deg = (rad) => (rad * 180) / Math.PI;
const rad = (deg) => (deg * Math.PI) / 180;
const EPS = 1e-4;

function sphToCart(theta, phi) {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  return { x, y, z };
}

function rotateAroundX(v, alpha) {
  const { x, y, z } = v;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  return { x, y: y * ca - z * sa, z: y * sa + z * ca };
}

function rotateAroundY(v, alpha) {
  const { x, y, z } = v;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  return { x: x * ca + z * sa, y, z: -x * sa + z * ca };
}

function rotateAroundZ(v, alpha) {
  const { x, y, z } = v;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  return { x: x * ca - y * sa, y: x * sa + y * ca, z };
}

function rotateAroundAxis(v, axis, alpha) {
  // Rodrigues' rotation formula
  const { x, y, z } = v;
  const [ax, ay, az] = axis;
  const len = Math.hypot(ax, ay, az) || 1;
  const nx = ax / len, ny = ay / len, nz = az / len;
  const ca = Math.cos(alpha);
  const sa = Math.sin(alpha);
  const dot = x * nx + y * ny + z * nz;
  return {
    x: x * ca + (ny * z - nz * y) * sa + nx * dot * (1 - ca),
    y: y * ca + (nz * x - nx * z) * sa + ny * dot * (1 - ca),
    z: z * ca + (nx * y - ny * x) * sa + nz * dot * (1 - ca),
  };
}

function cartToSph({ x, y, z }) {
  const r = Math.sqrt(x * x + y * y + z * z) || 1;
  const theta = Math.acos(z / r);
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;
  return { theta, phi };
}

// 2D projection removed; keeping only 3D view now

export default function QubitSimulator() {
  const [qubits, setQubits] = useState([{ theta: 0, phi: 0 }]);
  const [selected, setSelected] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastAppliedGate, setLastAppliedGate] = useState(null);
  const [currentPage, setCurrentPage] = useState('simulator');

  const vecOf = (i) => sphToCart(qubits[i].theta, qubits[i].phi);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const backToSimulator = () => {
    setCurrentPage('simulator');
  };

  function normalizeAngles(t, p) {
    // If at poles, force phi to 0 for stability
    if (Math.abs(t) < EPS || Math.abs(t - Math.PI) < EPS) {
      return { t, p: 0 };
    }
    return { t, p };
  }

  function setQubitAngles(i, t, p) {
    setQubits((qs) => qs.map((q, idx) => (idx === i ? { theta: t, phi: p } : q)));
  }

  function applyAxisRotationOn(index, axis, angle, label) {
    if (animating) return;
    setAnimating(true);
    const duration = 1.2;
    const start = 0;
    const end = angle;

    const controls = animate(start, end, {
      duration,
      ease: "easeInOut",
      onUpdate: (alpha) => {
        const v0 = vecOf(index);
        const vRot = Array.isArray(axis)
          ? rotateAroundAxis(v0, axis, alpha)
          : axis === "x"
          ? rotateAroundX(v0, alpha)
          : axis === "y"
          ? rotateAroundY(v0, alpha)
          : rotateAroundZ(v0, alpha);
        const { theta: tRaw, phi: pRaw } = cartToSph(vRot);
        const { t, p } = normalizeAngles(tRaw, pRaw);
        setQubitAngles(index, t, p);
      },
      onComplete: () => {
        setAnimating(false);
        setHistory((h) => [...h, label]);
      },
    });

    return () => controls.stop();
  }

  const applyX = () => {
    setLastAppliedGate('x');
    applyAxisRotationOn(selected, "x", Math.PI, `x q[${selected}]`);
  };
  const applyY = () => {
    setLastAppliedGate('y');
    applyAxisRotationOn(selected, "y", Math.PI, `y q[${selected}]`);
  };
  const applyZ = () => {
    setLastAppliedGate('z');
    applyAxisRotationOn(selected, "z", Math.PI, `z q[${selected}]`);
  };
  const applyS = () => {
    setLastAppliedGate('s');
    applyAxisRotationOn(selected, "z", Math.PI / 2, `s q[${selected}]`);
  };
  const applySdg = () => {
    setLastAppliedGate('sdg');
    applyAxisRotationOn(selected, "z", -Math.PI / 2, `sdg q[${selected}]`);
  };
  const applyT = () => {
    setLastAppliedGate('t');
    applyAxisRotationOn(selected, "z", Math.PI / 4, `t q[${selected}]`);
  };
  const applyTdg = () => {
    setLastAppliedGate('tdg');
    applyAxisRotationOn(selected, "z", -Math.PI / 4, `tdg q[${selected}]`);
  };
  const applyH = () => {
    setLastAppliedGate('h');
    applyAxisRotationOn(selected, [1, 0, 1], Math.PI, `h q[${selected}]`);
  };

  const reset = () => {
    setQubits([{ theta: 0, phi: 0 }]);
    setSelected(0);
    setHistory([]);
    setAnimating(false);
    setLastAppliedGate(null);
  };

  const setStateFromBloch = (tDeg, pDeg) => {
    const tRaw = rad(tDeg);
    const pRaw = rad(pDeg);
    const { t, p } = normalizeAngles(tRaw, pRaw);
    setQubitAngles(selected, t, p);
  };

  const copyCode = async () => {
    const code = buildQiskitCode(history, qubits.length);
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {}
  };

  // Two-qubit derived operations and helpers
  const probOne = (i) => {
    const z = Math.cos(qubits[i].theta);
    return (1 - z) / 2;
  };

  const anglesFromVec = (v) => {
    const { theta: tRaw, phi: pRaw } = cartToSph(v);
    return normalizeAngles(tRaw, pRaw);
  };

  const applyCNOT = () => {
    if (qubits.length < 2 || animating) return;
    setLastAppliedGate('cx');
    const c = 0, t = 1;
    const p = probOne(c);
    applyAxisRotationOn(t, "x", Math.PI * p, `cx q[${c}],q[${t}]`);
  };

  const applyCZ = () => {
    if (qubits.length < 2 || animating) return;
    setLastAppliedGate('cz');
    const c = 0, t = 1;
    const p = probOne(c);
    applyAxisRotationOn(t, "z", Math.PI * p, `cz q[${c}],q[${t}]`);
  };

  const applySWAP = () => {
    if (qubits.length < 2 || animating) return;
    setLastAppliedGate('swap');
    setQubits((qs) => {
      const a = qs[0], b = qs[1];
      return [{ ...b }, { ...a }, ...qs.slice(2)];
    });
    setHistory((h) => [...h, `swap q[0],q[1]`]);
  };

  const applyISWAP = () => {
    if (qubits.length < 2 || animating) return;
    setLastAppliedGate('iswap');
    setQubits((qs) => {
      const a = qs[0], b = qs[1];
      const rot = (q) => anglesFromVec(rotateAroundZ(sphToCart(q.theta, q.phi), Math.PI / 2));
      const a2 = rot(b);
      const b2 = rot(a);
      return [{ theta: a2.t, phi: a2.p }, { theta: b2.t, phi: b2.p }, ...qs.slice(2)];
    });
    setHistory((h) => [...h, `iswap q[0],q[1]`]);
  };

  const applyCCX = () => {
    if (qubits.length < 3 || animating) return;
    setLastAppliedGate('ccx');
    const c1 = 0, c2 = 1, t = 2;
    const p = probOne(c1) * probOne(c2);
    applyAxisRotationOn(t, "x", Math.PI * p, `ccx q[${c1}],q[${c2}] -> q[${t}]`);
  };

  const applyCSWAP = () => {
    if (qubits.length < 3 || animating) return;
    setLastAppliedGate('cswap');
    const c = 0, a = 1, b = 2;
    const p = probOne(c);
    const lerpSwap = (va, vb, k) => {
      const v = {
        x: (1 - k) * va.x + k * vb.x,
        y: (1 - k) * va.y + k * vb.y,
        z: (1 - k) * va.z + k * vb.z,
      };
      const len = Math.hypot(v.x, v.y, v.z) || 1;
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    };
    const va0 = sphToCart(qubits[a].theta, qubits[a].phi);
    const vb0 = sphToCart(qubits[b].theta, qubits[b].phi);
    const va1 = lerpSwap(va0, vb0, p);
    const vb1 = lerpSwap(vb0, va0, p);
    const na = anglesFromVec(va1), nb = anglesFromVec(vb1);
    setQubits((qs) => qs.map((q, i) => (i === a ? { theta: na.t, phi: na.p } : i === b ? { theta: nb.t, phi: nb.p } : q)));
    setHistory((h) => [...h, `cswap q[${c}] ? swap q[${a}],q[${b}]`]);
  };

  const blochAngles = `θ = ${deg(qubits[selected].theta).toFixed(1)}°,  φ = ${deg(qubits[selected].phi).toFixed(1)}°`;

  return (
    <div className="qubit-simulator">
      <Navbar onNavigate={navigateToPage} />

      {currentPage === 'about' && <AboutPage onBack={backToSimulator} />}
      {currentPage === 'gates' && <GatesPage onBack={backToSimulator} />}

            {currentPage === 'simulator' && (
        <ResizableLayout>
          <div className="card bloch-card">
            <div className="card-header">
              <h2 className="card-title">Bloch Sphere</h2>
            </div>
            <div className="card-content">
              <div className="bloch-content">
                <div className="spheres-grid">
                  {qubits.map((q, i) => {
                    const height = qubits.length === 1 ? 360 : qubits.length === 2 ? 260 : 220;
                    return (
                      <div key={i} className={`sphere-item ${i === selected ? "selected" : ""}`} onClick={() => setSelected(i)} style={{ height }}>
                        <BlochSphere3D theta={q.theta} phi={q.phi} />
                        <div className="sphere-label">q[{i}] — θ {deg(q.theta).toFixed(1)}°, φ {deg(q.phi).toFixed(1)}°</div>
                      </div>
                    );
                  })}
                </div>
                <div className="bloch-angles">Active: q[{selected}] — {blochAngles}</div>

                <div className="controls-container">
                  <div className="control-group">
                    <div className="control-label">θ (0°–180°)</div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="0.5"
                      value={deg(qubits[selected].theta)}
                      onChange={(e) => setStateFromBloch(parseFloat(e.target.value), deg(qubits[selected].phi))}
                      className="slider"
                    />
                    <div className="control-value">{deg(qubits[selected].theta).toFixed(1)}°</div>
                  </div>
                  <div className="control-group">
                    <div className="control-label">φ (0°–360°)</div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="0.5"
                      value={deg(qubits[selected].phi)}
                      onChange={(e) => setStateFromBloch(deg(qubits[selected].theta), parseFloat(e.target.value))}
                      className="slider"
                    />
                    <div className="control-value">{deg(qubits[selected].phi).toFixed(1)}°</div>
                  </div>
                </div>

                <div className="button-group">
                  <button onClick={applyX} disabled={animating} className="button button-primary">X</button>
                  <button onClick={applyY} disabled={animating} className="button button-primary">Y</button>
                  <button onClick={applyZ} disabled={animating} className="button button-primary">Z</button>
                  <button onClick={applyH} disabled={animating} className="button button-primary">H</button>
                  <button onClick={applyS} disabled={animating} className="button button-primary">S</button>
                  <button onClick={applySdg} disabled={animating} className="button button-primary">S+</button>
                  <button onClick={applyT} disabled={animating} className="button button-primary">T</button>
                  <button onClick={applyTdg} disabled={animating} className="button button-primary">T+</button>
                  <button onClick={reset} disabled={animating} className="button button-secondary">Reset |0⟩</button>
                </div>

                {qubits.length >= 2 && (
                  <div className="button-group">
                    <button onClick={applyCNOT} disabled={animating} className="button button-primary">CNOT (q0→q1)</button>
                    <button onClick={applyCZ} disabled={animating} className="button button-primary">CZ (q0→q1)</button>
                    <button onClick={applySWAP} disabled={animating} className="button button-primary">SWAP (q0↔q1)</button>
                    <button onClick={applyISWAP} disabled={animating} className="button button-primary">iSWAP (q0↔q1)</button>
                  </div>
                )}

                {qubits.length >= 3 && (
                  <div className="button-group">
                    <button onClick={applyCCX} disabled={animating} className="button button-primary">CCX (q0,q1→q2)</button>
                    <button onClick={applyCSWAP} disabled={animating} className="button button-primary">CSWAP (q0? q1↔q2)</button>
                  </div>
                )}

                <div className="button-group">
                  <button
                    onClick={() => {
                      if (qubits.length < 3 && !animating) {
                        setQubits((qs) => [...qs, { theta: 0, phi: 0 }]);
                      }
                    }}
                    disabled={qubits.length >= 3 || animating}
                    className="button button-secondary"
                  >
                    Add qubit
                  </button>
                  <button
                    onClick={() => {
                      if (qubits.length > 1 && !animating) {
                        const next = qubits.filter((_, i) => i !== selected);
                        const finalList = next.length ? next : [{ theta: 0, phi: 0 }];
                        setQubits(finalList);
                        const newIndex = Math.min(selected, Math.max(0, finalList.length - 1));
                        setSelected(newIndex);
                      }
                    }}
                    disabled={qubits.length <= 1 || animating}
                    className="button button-secondary"
                  >
                    Remove selected q[{selected}]
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Matrix Display */}
          {lastAppliedGate && (
            <div className="card gate-matrix-card">
              <div className="card-header">
                <h2 className="card-title">Gate Matrix Representation</h2>
              </div>
              <div className="card-content">
                <GateMatrix gateType={lastAppliedGate} isVisible={true} />
              </div>
            </div>
          )}

          <div className="card code-card">
            <div className="card-header">
              <h2 className="card-title">Code (IBM Quantum / Qiskit-like)</h2>
            </div>
            <div className="card-content">
              <div className="code-content">
                <p className="code-description">This snippet mirrors the actions you take above. Copy and paste into a Python notebook with Qiskit installed.</p>
                <CodeBlock history={history} numQubits={qubits.length} onCopy={copyCode} />
                <div className="code-notes">
                  <p className="notes-title">Notes</p>
                  <ul className="notes-list">
                    <li><span className="highlight">Single-qubit gates:</span> X, Y, Z, H, S, S†, T, T†.</li>
                    <li><span className="highlight">Two-qubit gates:</span> CNOT, CZ, SWAP, iSWAP.</li>
                    <li><span className="highlight">Three-qubit gates:</span> CCX (Toffoli), CSWAP (Fredkin).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ResizableLayout>
      )}
    </div>
  );
}

function buildQiskitCode(history, numQubits) {
  const lines = [
    "from qiskit import QuantumCircuit",
  ];
  const needsISWAP = history.some(h => /^iswap\s+q\[\d+\],q\[\d+\]$/i.test(h));
  if (needsISWAP) {
    lines.push("from qiskit.circuit.library import iSwapGate");
  }
  lines.push(`qc = QuantumCircuit(${Math.max(1, numQubits || 1)})`);

  if (!history.length) {
    lines.push("# (no gates applied yet)");
  }

  for (const h of history) {
    let m;
    if ((m = /^(x|y|z|h|s|sdg|t|tdg)\s+q\[(\d+)\]$/i.exec(h))) {
      const gate = m[1].toLowerCase();
      const q = parseInt(m[2], 10);
      lines.push(`qc.${gate}(${q})`);
      continue;
    }
    if ((m = /^(cx|cz)\s+q\[(\d+)\],q\[(\d+)\]$/i.exec(h))) {
      const gate = m[1].toLowerCase();
      const c = parseInt(m[2], 10);
      const t = parseInt(m[3], 10);
      lines.push(`qc.${gate}(${c}, ${t})`);
      continue;
    }
    if ((m = /^swap\s+q\[(\d+)\],q\[(\d+)\]$/i.exec(h))) {
      const a = parseInt(m[1], 10); const b = parseInt(m[2], 10);
      lines.push(`qc.swap(${a}, ${b})`);
      continue;
    }
    if ((m = /^iswap\s+q\[(\d+)\],q\[(\d+)\]$/i.exec(h))) {
      const a = parseInt(m[1], 10); const b = parseInt(m[2], 10);
      lines.push(`qc.append(iSwapGate(), [${a}, ${b}])`);
      continue;
    }
    if ((m = /^ccx\s+q\[(\d+)\],q\[(\d+)\]\s*->\s*q\[(\d+)\]$/i.exec(h))) {
      const c1 = parseInt(m[1], 10); const c2 = parseInt(m[2], 10); const t = parseInt(m[3], 10);
      lines.push(`qc.ccx(${c1}, ${c2}, ${t})`);
      continue;
    }
    if ((m = /^cswap\s+q\[(\d+)\]\s*\?\s*swap\s+q\[(\d+)\],q\[(\d+)\]$/i.exec(h))) {
      const c = parseInt(m[1], 10); const a = parseInt(m[2], 10); const b = parseInt(m[3], 10);
      lines.push(`qc.cswap(${c}, ${a}, ${b})`);
      continue;
    }
    // Fallback: comment unknown history entry
    lines.push(`# ${h}`);
  }

  lines.push("print(qc)");
  return lines.join("\n");
}

function CodeBlock({ history, numQubits, onCopy }) {
  const code = buildQiskitCode(history, numQubits);
  return (
    <div className="code-block">
      <pre className="code-content">
        <code>{code}</code>
      </pre>
      <button onClick={onCopy} className="copy-button">
        <Copy size={14} /> Copy
      </button>
    </div>
  );
}