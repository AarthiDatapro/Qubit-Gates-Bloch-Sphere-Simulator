import React, { useState } from 'react';
import { Menu, X, Info, Zap } from 'lucide-react';

const Navbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const openSection = (section) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1 className="navbar-title">🧬 Qubit Simulator</h1>
            <p className="navbar-subtitle">Interactive Quantum Computing Visualization</p>
          </div>
          
          <div className="navbar-menu">
            <button 
              className="navbar-item"
              onClick={() => openSection('about')}
            >
              <Info size={16} />
              About
            </button>
            <button 
              className="navbar-item"
              onClick={() => openSection('gates')}
            >
              <Zap size={16} />
              Gates
            </button>
          </div>

          <button className="navbar-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="navbar-mobile-menu">
            <button 
              className="navbar-mobile-item"
              onClick={() => openSection('about')}
            >
              <Info size={16} />
              About Quantum Computing
            </button>
            <button 
              className="navbar-mobile-item"
              onClick={() => openSection('gates')}
            >
              <Zap size={16} />
              Know About Gates
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
