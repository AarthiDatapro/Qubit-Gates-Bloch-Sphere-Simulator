import React from 'react';

const GateMatrix = ({ gateType, isVisible }) => {
  if (!isVisible) return null;

  const getGateMatrix = (gate) => {
    switch (gate.toLowerCase()) {
      case 'x':
        return {
          matrix: [
            [0, 1],
            [1, 0]
          ],
          name: 'X Gate (NOT)',
          description: 'Flips the qubit state (|0⟩ ↔ |1⟩)'
        };
      case 'y':
        return {
          matrix: [
            [0, '-i'],
            ['i', 0]
          ],
          name: 'Y Gate',
          description: '180° rotation around the Y-axis'
        };
      case 'z':
        return {
          matrix: [
            [1, 0],
            [0, -1]
          ],
          name: 'Z Gate',
          description: '180° rotation around the Z-axis'
        };
      case 'h':
        return {
          matrix: [
            ['1/√2', '1/√2'],
            ['1/√2', '-1/√2']
          ],
          name: 'H Gate (Hadamard)',
          description: 'Creates superposition state'
        };
      case 's':
        return {
          matrix: [
            [1, 0],
            [0, 'i']
          ],
          name: 'S Gate',
          description: '90° rotation around Z-axis'
        };
      case 'sdg':
        return {
          matrix: [
            [1, 0],
            [0, '-i']
          ],
          name: 'S† Gate',
          description: '-90° rotation around Z-axis'
        };
      case 't':
        return {
          matrix: [
            [1, 0],
            [0, 'e^(iπ/4)']
          ],
          name: 'T Gate',
          description: '45° rotation around Z-axis'
        };
      case 'tdg':
        return {
          matrix: [
            [1, 0],
            [0, 'e^(-iπ/4)']
          ],
          name: 'T† Gate',
          description: '-45° rotation around Z-axis'
        };
      case 'cx':
        return {
          matrix: [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [0, 0, 1, 0]
          ],
          name: 'CNOT Gate',
          description: 'Controlled NOT operation'
        };
      case 'cz':
        return {
          matrix: [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, -1]
          ],
          name: 'CZ Gate',
          description: 'Controlled Z operation'
        };
      case 'swap':
        return {
          matrix: [
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1]
          ],
          name: 'SWAP Gate',
          description: 'Exchanges two qubit states'
        };
      case 'iswap':
        return {
          matrix: [
            [1, 0, 0, 0],
            [0, 0, 'i', 0],
            [0, 'i', 0, 0],
            [0, 0, 0, 1]
          ],
          name: 'iSWAP Gate',
          description: 'i times SWAP operation'
        };
      case 'ccx':
        return {
          matrix: [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1, 0]
          ],
          name: 'CCX Gate (Toffoli)',
          description: 'Controlled Controlled NOT: flips target qubit only when both control qubits are |1⟩'
        };
      case 'cswap':
        return {
          matrix: [
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1]
          ],
          name: 'CSWAP Gate (Fredkin)',
          description: 'Controlled SWAP: swaps target qubits only when control qubit is |1⟩'
        };
      default:
        return null;
    }
  };

  const gateInfo = getGateMatrix(gateType);
  if (!gateInfo) return null;

  const is2x2 = gateInfo.matrix.length === 2;
  const is4x4 = gateInfo.matrix.length === 4;

  return (
    <div className="gate-matrix-display">
      <div className="gate-matrix-header">
        <h3>{gateInfo.name}</h3>
        <p>{gateInfo.description}</p>
      </div>
      
      <div className={`matrix-container ${is2x2 ? 'matrix-2x2' : is4x4 ? 'matrix-4x4' : 'matrix-8x8'}`}>
        <div className="matrix-bracket matrix-left">[</div>
        <div className="matrix-content">
          {gateInfo.matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="matrix-row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="matrix-cell">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="matrix-bracket matrix-right">]</div>
      </div>
      
      <div className="gate-matrix-footer">
        <p className="matrix-note">
          This matrix represents the quantum gate transformation in the computational basis.
        </p>
      </div>
    </div>
  );
};

export default GateMatrix;
