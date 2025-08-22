# Qubit Simulator

An interactive Bloch sphere visualization built with React, featuring real-time quantum state manipulation and X-gate animations.

## Features

- **Interactive Bloch Sphere**: Visualize qubit states using spherical coordinates (θ, φ)
- **Real-time Controls**: Adjust angles using intuitive sliders
- **X-Gate Animation**: Watch the Bloch vector rotate around the X-axis with smooth animations
- **Qiskit Code Generation**: Automatically generates Python code that mirrors your interactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Dependencies

- **React 18** - UI framework
- **framer-motion** - Smooth animations for the X-gate rotation
- **lucide-react** - Clean, consistent icons

## Project Structure

```
qubit-simulator/
├── QubitSimulator.jsx    # Main component with Bloch sphere logic
├── App.js                # App entry point
├── App.css               # All styling (replaces Tailwind)
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## How It Works

The simulator uses:
- **SVG graphics** for the Bloch sphere visualization
- **Spherical to Cartesian coordinate conversion** for 3D positioning
- **Orthographic projection** for 2D display
- **Framer Motion** for smooth X-gate rotation animations
- **Custom CSS** that replicates Tailwind's design system

## Usage

1. **Adjust θ (theta)**: Controls the angle from the Z-axis (0° = |0⟩, 180° = |1⟩)
2. **Adjust φ (phi)**: Controls the rotation around the Z-axis (0° to 360°)
3. **Apply X gate**: Click to see the Bloch vector rotate by π around the X-axis
4. **Reset**: Return to the |0⟩ state
5. **Copy Code**: Generate and copy Qiskit-compatible Python code

## Customization

All styling is contained in `App.css` with clear class names that correspond to the original Tailwind classes. You can easily modify colors, spacing, shadows, and other visual properties.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

