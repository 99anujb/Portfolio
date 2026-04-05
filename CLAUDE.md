# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal portfolio website for Anuj Bansal — Data Scientist & ML Engineer. Built with React 18 + TypeScript + Vite, featuring a 3D animated character, physics-based tech stack visualization, and scroll-driven animations.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Architecture

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component (lazy loads Character + MainContainer)
├── App.css                     # Container responsive styles
├── index.css                   # Global styles, CSS variables, fonts
├── context/
│   └── LoadingProvider.tsx      # Loading state context
├── data/
│   └── boneData.ts             # Character bone names for animations
├── types/
│   └── gsap-splittext.d.ts     # GSAP SplitText type definitions
└── components/
    ├── Landing.tsx              # Hero section (name + role cycling)
    ├── About.tsx                # About me section
    ├── WhatIDo.tsx              # Skills cards (Data Science & ML / Analytics & Viz)
    ├── TechStack.tsx            # 3D physics tech spheres (R3F + Rapier)
    ├── Career.tsx               # Career timeline
    ├── Work.tsx                 # Project carousel (8 projects)
    ├── Contact.tsx              # Contact + footer
    ├── Navbar.tsx               # Navigation (uses GSAP ScrollSmoother)
    ├── Cursor.tsx               # Custom cursor
    ├── Loading.tsx              # Loading screen
    ├── MainContainer.tsx        # Layout wrapper
    ├── SocialIcons.tsx          # Fixed social links
    ├── HoverLinks.tsx           # Hover text animation
    ├── Character/               # 3D character model system
    │   ├── index.tsx            # Entry
    │   ├── Scene.tsx            # Three.js scene, camera, renderer
    │   └── utils/
    │       ├── character.ts     # GLTF model loading (encrypted + DRACO)
    │       ├── animationUtils.ts # Character animations
    │       ├── lighting.ts      # Scene lighting + HDR environment
    │       ├── mouseUtils.ts    # Head rotation tracking
    │       ├── resizeUtils.ts   # Responsive handling
    │       └── decrypt.ts       # AES decryption for model
    ├── utils/
    │   ├── initialFX.ts         # Page load animations (SplitText)
    │   ├── splitText.ts         # Scroll-triggered text animations
    │   └── GsapScroll.ts        # Character + section scroll timelines
    └── styles/                  # Per-component CSS files
        ├── Landing.css, About.css, Career.css, Contact.css
        ├── Work.css, WhatIDo.css, Navbar.css, Cursor.css
        ├── Loading.css, SocialIcons.css, style.css
```

## Key Dependencies

- **Three.js** + **React Three Fiber** + **Drei** — 3D rendering
- **Rapier** — Physics engine for TechStack spheres
- **GSAP** — Animations (includes premium: ScrollSmoother, SplitText)
- **three-stdlib** — GLTF/DRACO loaders
- **react-fast-marquee** — Loading screen marquee
- **react-icons** — Icon library

## Design System

- **Accent**: `#5eead4` (teal)
- **Background**: `#0a0e17` (dark navy)
- **Font**: Geist (Google Fonts)
- **Cursor**: Custom with mix-blend-mode: difference

## Personal Info (Anuj Bansal)

- Email: 99anujbansal@gmail.com
- Phone: (508) 965-2806
- GitHub: github.com/99anujb
- LinkedIn: linkedin.com/in/anuj-bansal-854772189
- Location: Boston / New York / Texas / Remote
- Education: MS Data Science @ UMass Dartmouth (2024–Present), B.Tech Mech Eng @ PTU (2016–2020)
