# Anuj Bansal — Personal Portfolio

An interactive 3D portfolio website showcasing my work in **Data Science**, **Machine Learning**, **Data Analytics**, and **Business Intelligence**.

Built with React, TypeScript, and Three.js — featuring a 3D animated character, physics-based tech stack visualization, scroll-driven animations, and dynamically generated project previews.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | React 18, TypeScript, Vite |
| **3D Engine** | Three.js, React Three Fiber, Drei |
| **Physics** | Rapier (via @react-three/rapier) |
| **Animation** | GSAP (ScrollSmoother, SplitText, ScrollTrigger) |
| **Post-processing** | @react-three/postprocessing (N8AO) |
| **Styling** | CSS with custom design system (Geist font) |

## Features

- **3D Character Model** — Encrypted GLTF model with DRACO compression, mouse-tracking head rotation, and scroll-driven pose transitions
- **Physics Tech Spheres** — 30 interactive spheres with canvas-generated textures representing data science tools (Python, PyTorch, TensorFlow, Pandas, etc.)
- **Scroll Animations** — Full-page scroll-driven camera movements, section transitions, and text reveals using GSAP ScrollTrigger
- **Role Cycling** — Animated role text cycling through Data Scientist, ML Engineer, Data Analyst, and Business Analyst
- **Project Carousel** — 8 projects with programmatically generated canvas visualizations (heatmaps, charts, scatter plots, network diagrams)
- **Custom Cursor** — Mix-blend-mode cursor with hover effects
- **Responsive Design** — Adapts from mobile to ultrawide displays

## Projects Featured

| # | Project | Category | Key Tools | Status |
|---|---------|----------|-----------|--------|
| 01 | **AFM Z-Height Map Prediction** | Deep Learning / Research | PyTorch, CNN, ResNet18, Attention U-Net | Completed |
| 02 | **Customer Churn Predictor** | ML / Explainability | XGBoost, SHAP, Streamlit, Pandas | Completed |
| 03 | **Zomato Rating Predictor** | Machine Learning | Flask, Scikit-learn, Feature Engineering | Completed |
| 04 | **YouTube Channel Analytics** | Regression Analysis | Matplotlib, Statistical Modeling | Completed |
| 05 | **Sustainable Fashion Viz** | Data Visualization | D3.js, Tableau, JavaScript | Completed |
| 06 | **Disease Risk Prediction** | Healthcare / Predictive Analytics | Sklearn, Streamlit, SHAP | Coming Soon |
| 07 | **Research Paper Summarizer & Job Match Agent** | AI Agents / NLP | LangChain, OpenAI API, Streamlit | Coming Soon |
| 08 | **Financial Fraud Detection** | Anomaly Detection / Deep Learning | Isolation Forest, Autoencoder, Plotly | Coming Soon |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/99anujb/portfolio.git
cd portfolio
npm install
```

### Development

```bash
npm run dev        # Start dev server at http://localhost:5173
```

### Production Build

```bash
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview the production build locally
```

### Linting

```bash
npm run lint       # Run ESLint
```

## Project Structure

```
src/
├── main.tsx                     # Entry point
├── App.tsx                      # Root (lazy loads Character + MainContainer)
├── context/
│   └── LoadingProvider.tsx       # Loading state context
├── components/
│   ├── Landing.tsx               # Hero — name + cycling roles
│   ├── About.tsx                 # About me section
│   ├── WhatIDo.tsx               # Skills cards (Data Science & ML / Analytics & Viz)
│   ├── TechStack.tsx             # 3D physics tech spheres (R3F + Rapier)
│   ├── Career.tsx                # Career timeline
│   ├── Work.tsx                  # Project carousel with canvas visualizations
│   ├── Contact.tsx               # Contact + footer
│   ├── Navbar.tsx                # Navigation (GSAP ScrollSmoother)
│   ├── Character/                # 3D character model system
│   │   ├── Scene.tsx             # Three.js scene, camera, renderer
│   │   └── utils/                # Model loading, animations, lighting
│   └── utils/
│       ├── initialFX.ts          # Page load animations
│       ├── splitText.ts          # Scroll-triggered text animations
│       └── GsapScroll.ts         # Character + section scroll timelines
└── styles/                       # Per-component CSS files
```

## Design System

| Token | Value |
|-------|-------|
| **Accent** | `#5eead4` (teal) |
| **Background** | `#0a0e17` (dark navy) |
| **Font** | Geist (Google Fonts) |
| **Cursor** | Custom with `mix-blend-mode: difference` |

## Credits

Portfolio design based on [akashrmalhotra/3d-portfolio](https://github.com/akashrmalhotra/3d-portfolio).

---

**Anuj Bansal** — Data Scientist & ML Engineer

[GitHub](https://github.com/99anujb) · [LinkedIn](https://linkedin.com/in/anuj-bansal-854772189) · [Email](mailto:99anujbansal@gmail.com)
