import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const AboutPage = ({ onBack }) => {
  return (
    <div className="about-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Simulator
        </button>
        <h1>About Quantum Computing</h1>
      </div>
      
      <div className="page-content">
        <div className="content-section">
          <h2>What is Quantum Computing?</h2>
          <p>
            Quantum computing is a revolutionary technology that harnesses the collective properties of quantum states 
            to perform calculations. Unlike classical computers that use bits (0 or 1), quantum computers use quantum 
            bits or qubits that can exist in multiple states simultaneously through superposition and entanglement.
          </p>
          <p>
            This simulator demonstrates fundamental quantum gates and their effects on qubit states visualized through 
            the Bloch sphere representation. Each gate performs a specific transformation on the quantum state, enabling 
            complex quantum algorithms and computations.
          </p>
        </div>

        <div className="content-section">
          <h2>Key Quantum Concepts</h2>
          <div className="concepts-grid">
            <div className="concept-item">
              <h3>Superposition</h3>
              <p>A qubit can exist in a combination of |0⟩ and |1⟩ states simultaneously, unlike classical bits that are either 0 or 1.</p>
            </div>
            <div className="concept-item">
              <h3>Entanglement</h3>
              <p>Multiple qubits can become correlated in ways that classical systems cannot achieve, enabling powerful computational capabilities.</p>
            </div>
            <div className="concept-item">
              <h3>Quantum Gates</h3>
              <p>Operations that manipulate qubit states, similar to logic gates in classical computing but operating on quantum superpositions.</p>
            </div>
            <div className="concept-item">
              <h3>Bloch Sphere</h3>
              <p>A geometric representation of a qubit's state, showing the relationship between quantum states and classical 3D space.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>Learn More</h2>
          <p>
            Explore our comprehensive presentation on quantum computing fundamentals to dive deeper into the mathematics, 
            physics, and applications of this exciting field.
          </p>
          <div className="gamma-link">
            <a 
              href="https://gamma.app/docs/quantum-computing-fundamentals" 
              target="_blank" 
              rel="noopener noreferrer"
              className="gamma-button"
            >
              <ExternalLink size={16} />
              View Gamma Presentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
