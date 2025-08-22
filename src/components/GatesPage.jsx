import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GatesPage = ({ onBack }) => {
  return (
    <div className="gates-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Simulator
        </button>
        <h1>Quantum Gates Explained</h1>
      </div>
      
      <div className="page-content">
        <div className="content-section">
          <h2>Single-Qubit Gates</h2>
          <div className="gates-grid">
            <div className="gate-item">
              <h3>X Gate (NOT)</h3>
              <div className="gate-matrix">[0 1; 1 0]</div>
              <p>Flips the qubit state (|0⟩ ↔ |1⟩). Equivalent to a 180° rotation around the X-axis.</p>
            </div>
            
            <div className="gate-item">
              <h3>Y Gate</h3>
              <div className="gate-matrix">[0 -i; i 0]</div>
              <p>180° rotation around the Y-axis. Combines X and Z operations.</p>
            </div>
            
            <div className="gate-item">
              <h3>Z Gate</h3>
              <div className="gate-matrix">[1 0; 0 -1]</div>
              <p>180° rotation around the Z-axis. Adds a phase of π to |1⟩ state.</p>
            </div>
            
            <div className="gate-item">
              <h3>H Gate (Hadamard)</h3>
              <div className="gate-matrix">[1 1; 1 -1]/√2</div>
              <p>Creates superposition: |0⟩ → (|0⟩ + |1⟩)/√2, |1⟩ → (|0⟩ - |1⟩)/√2</p>
            </div>
            
            <div className="gate-item">
              <h3>S Gate</h3>
              <div className="gate-matrix">[1 0; 0 i]</div>
              <p>90° rotation around Z-axis. Adds a phase of π/2 to |1⟩ state.</p>
            </div>
            
            <div className="gate-item">
              <h3>T Gate</h3>
              <div className="gate-matrix">[1 0; 0 e^(iπ/4)]</div>
              <p>45° rotation around Z-axis. Adds a phase of π/4 to |1⟩ state.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Two-Qubit Gates</h2>
          <div className="gates-grid">
            <div className="gate-item">
              <h3>CNOT Gate</h3>
              <div className="gate-matrix">[1 0 0 0; 0 1 0 0; 0 0 0 1; 0 0 1 0]</div>
              <p>Controlled NOT: flips target qubit only when control qubit is |1⟩.</p>
            </div>
            
            <div className="gate-item">
              <h3>CZ Gate</h3>
              <div className="gate-matrix">[1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 -1]</div>
              <p>Controlled Z: applies Z gate to target qubit only when control qubit is |1⟩.</p>
            </div>
            
            <div className="gate-item">
              <h3>SWAP Gate</h3>
              <div className="gate-matrix">[1 0 0 0; 0 0 1 0; 0 1 0 0; 0 0 0 1]</div>
              <p>Exchanges the states of two qubits.</p>
            </div>
            
            <div className="gate-item">
              <h3>iSWAP Gate</h3>
              <div className="gate-matrix">[1 0 0 0; 0 0 i 0; 0 i 0 0; 0 0 0 1]</div>
              <p>i times SWAP operation with additional phase factors.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Three-Qubit Gates</h2>
          <div className="gates-grid">
            <div className="gate-item">
              <h3>CCX Gate (Toffoli)</h3>
              <div className="gate-matrix">8×8 matrix</div>
              <p>Controlled Controlled NOT: flips target qubit only when both control qubits are |1⟩.</p>
            </div>
            
            <div className="gate-item">
              <h3>CSWAP Gate (Fredkin)</h3>
              <div className="gate-matrix">8×8 matrix</div>
              <p>Controlled SWAP: swaps target qubits only when control qubit is |1⟩.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Understanding Gate Operations</h2>
          <p>
            Each quantum gate performs a specific unitary transformation on the quantum state. The matrix representation 
            shows how the gate acts on the computational basis states. When you apply gates in the simulator, you can 
            see their matrix representations and understand how they transform the qubit states.
          </p>
          <p>
            The Bloch sphere visualization helps you see the geometric interpretation of these operations, making it 
            easier to understand quantum computing concepts intuitively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GatesPage;
