# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade portfolio with SEO, performance optimizations, UX features (touch swipe, contact form, CTA), accessibility, and code quality fixes.

**Architecture:** In-place enhancement of existing React 18 + Vite SPA. No framework changes. New context for ScrollSmoother, IntersectionObserver for lazy 3D, pointer events for swipe, Formspree for contact form.

**Tech Stack:** React 18, TypeScript, Vite, GSAP (ScrollTrigger), Three.js/R3F/Rapier, Formspree, @vercel/analytics

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Modify | `index.html` | Add structured data, sitemap link |
| Create | `public/sitemap.xml` | SEO sitemap |
| Modify | `public/robots.txt` | Add sitemap reference |
| Create | `src/context/SmootherContext.tsx` | ScrollSmoother React context |
| Modify | `src/components/Navbar.tsx` | Use SmootherContext, React event handlers |
| Modify | `src/components/TechStack.tsx` | Lazy mount, mobile optimization, deferred textures |
| Modify | `src/components/MainContainer.tsx` | Wire SmootherContext |
| Modify | `src/components/Landing.tsx` | Reduce roles, add CTA, aria-live |
| Modify | `src/components/styles/Landing.css` | CTA button styles |
| Modify | `src/components/About.tsx` | Add metrics row |
| Modify | `src/components/styles/About.css` | Metrics styles |
| Modify | `src/components/Work.tsx` | Touch swipe, keyboard nav, project links |
| Modify | `src/components/styles/Work.css` | Touch feedback styles |
| Modify | `src/components/Career.tsx` | ScrollTrigger stagger animations |
| Modify | `src/components/Contact.tsx` | Add contact form |
| Modify | `src/components/styles/Contact.css` | Form styles |
| Modify | `src/components/Cursor.tsx` | Touch device detection |
| Modify | `src/components/styles/Cursor.css` | Hide on touch devices |
| Modify | `src/index.css` | Focus-visible styles, skip-nav |
| Modify | `src/App.tsx` | Add Vercel Analytics |
| Modify | `package.json` | Add @vercel/analytics |

---

### Task 1: SEO — Structured Data & Sitemap

**Files:**
- Modify: `index.html:1-30`
- Modify: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Add JSON-LD structured data to index.html**

Add before closing `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Anuj Bansal",
  "jobTitle": "Data Scientist & ML Engineer",
  "url": "https://portfolio-mu-inky-15.vercel.app",
  "email": "99anujbansal@gmail.com",
  "sameAs": [
    "https://github.com/99anujb",
    "https://linkedin.com/in/anuj-bansal-854772189"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "UMass Dartmouth"
  },
  "knowsAbout": ["Data Science", "Machine Learning", "Deep Learning", "Python", "PyTorch"]
}
</script>
```

- [ ] **Step 2: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://portfolio-mu-inky-15.vercel.app/</loc>
    <lastmod>2026-04-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Update robots.txt**

```
User-agent: *
Disallow:

Sitemap: https://portfolio-mu-inky-15.vercel.app/sitemap.xml
```

- [ ] **Step 4: Verify by running build**

Run: `npm run build`
Expected: Build succeeds, `dist/sitemap.xml` and `dist/robots.txt` present.

- [ ] **Step 5: Commit**

```bash
git add index.html public/sitemap.xml public/robots.txt
git commit -m "feat(seo): add JSON-LD structured data and sitemap"
```

---

### Task 2: SmootherContext — Replace Module-Level Export

**Files:**
- Create: `src/context/SmootherContext.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/MainContainer.tsx`
- Modify: `src/components/Work.tsx:656-667`

- [ ] **Step 1: Create SmootherContext**

Create `src/context/SmootherContext.tsx`:

```tsx
import { createContext, useContext, useRef, PropsWithChildren } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

interface SmootherContextType {
  smootherRef: React.MutableRefObject<ScrollSmoother | null>;
}

const SmootherContext = createContext<SmootherContextType | null>(null);

export const SmootherProvider = ({ children }: PropsWithChildren) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  return (
    <SmootherContext.Provider value={{ smootherRef }}>
      {children}
    </SmootherContext.Provider>
  );
};

export const useSmoother = () => {
  const context = useContext(SmootherContext);
  if (!context) {
    throw new Error("useSmoother must be used within SmootherProvider");
  }
  return context.smootherRef;
};
```

- [ ] **Step 2: Update Navbar to use context instead of module export**

Replace the module-level `export let smoother: ScrollSmoother;` and usage in Navbar.tsx:

```tsx
import { useEffect, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useSmoother } from "../context/SmootherContext";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const Navbar = () => {
  const smootherRef = useSmoother();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (window.innerWidth > 1024 && smootherRef.current) {
        e.preventDefault();
        const section = e.currentTarget.getAttribute("data-href");
        if (section) {
          smootherRef.current.scrollTo(section, true, "top top");
        }
      }
    },
    [smootherRef]
  );

  useEffect(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smootherRef.current.scrollTop(0);
    smootherRef.current.paused(true);

    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [smootherRef]);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AB
        </a>
        <a
          href="https://linkedin.com/in/anuj-bansal-854772189"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          99anujbansal@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about" onClick={handleNavClick}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" onClick={handleNavClick}>
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" onClick={handleNavClick}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
```

- [ ] **Step 3: Wrap App with SmootherProvider**

In `src/components/MainContainer.tsx`, import and use. In `src/App.tsx`:

```tsx
import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { SmootherProvider } from "./context/SmootherContext";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <SmootherProvider>
          <Suspense>
            <MainContainer>
              <Suspense>
                <CharacterModel />
              </Suspense>
            </MainContainer>
          </Suspense>
        </SmootherProvider>
      </LoadingProvider>
    </>
  );
};

export default App;
```

- [ ] **Step 4: Update Work.tsx modal to use context**

Replace `import { smoother } from "./Navbar";` with:

```tsx
import { useSmoother } from "../context/SmootherContext";
```

And inside `CaseStudyModal`, use:

```tsx
function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const smootherRef = useSmoother();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    if (smootherRef.current) smootherRef.current.paused(true);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      if (smootherRef.current) smootherRef.current.paused(false);
    };
  }, [onClose, smootherRef]);
  // ... rest unchanged
```

- [ ] **Step 5: Verify build compiles**

Run: `npm run build`
Expected: No TypeScript errors, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/context/SmootherContext.tsx src/components/Navbar.tsx src/App.tsx src/components/Work.tsx
git commit -m "refactor: replace module-level smoother export with React context"
```

---

### Task 3: TechStack Performance — Lazy Mount + Mobile Optimization

**Files:**
- Modify: `src/components/TechStack.tsx`
- Modify: `src/components/MainContainer.tsx:46-49`

- [ ] **Step 1: Rewrite TechStack with deferred textures and mobile sphere reduction**

Replace entire `src/components/TechStack.tsx`:

```tsx
import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const techItems = [
  { name: "Python", color: "#3776AB" },
  { name: "R", color: "#276DC3" },
  { name: "SQL", color: "#E48E00" },
  { name: "PyTorch", color: "#EE4C2C" },
  { name: "TensorFlow", color: "#FF6F00" },
  { name: "Scikit-learn", color: "#F7931E" },
  { name: "Pandas", color: "#150458" },
  { name: "NumPy", color: "#4DABCF" },
  { name: "Tableau", color: "#E97627" },
  { name: "Power BI", color: "#F2C811" },
  { name: "Spark", color: "#E25A1C" },
  { name: "AWS", color: "#FF9900" },
  { name: "Docker", color: "#2496ED" },
  { name: "Jupyter", color: "#F37626" },
  { name: "Matplotlib", color: "#11557C" },
  { name: "Hugging Face", color: "#FFD21E" },
];

function createTechTexture(name: string, brandColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, brandColor);
  gradient.addColorStop(1, "#0a0e17");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 256, 256, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = brandColor;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(256, 256, 200, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = name.length > 8 ? 60 : name.length > 5 ? 72 : 90;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.shadowColor = brandColor;
  ctx.shadowBlur = 20;
  ctx.fillText(name, 256, 256);
  ctx.shadowBlur = 0;

  return new THREE.CanvasTexture(canvas);
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );
    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const isMobile = window.innerWidth < 768;
  const sphereCount = isMobile ? 12 : 30;

  const spheres = useMemo(
    () =>
      [...Array(sphereCount)].map(() => ({
        scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
      })),
    [sphereCount]
  );

  // IntersectionObserver for lazy mount
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ScrollTrigger-based activation
  useEffect(() => {
    if (!isVisible) return;
    const handleScroll = () => {
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const threshold = workEl.getBoundingClientRect().top;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsActive(scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const textures = useMemo(
    () => techItems.map((item) => createTechTexture(item.name, item.color)),
    []
  );

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, [textures]);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2> My Techstack</h2>

      {isVisible && (
        <Canvas
          shadows
          gl={{
            alpha: true,
            stencil: false,
            depth: false,
            antialias: false,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
          }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
        >
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={materials[i % materials.length]}
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
};

export default TechStack;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/TechStack.tsx
git commit -m "perf: lazy-mount TechStack canvas, reduce spheres on mobile, defer textures"
```

---

### Task 4: Landing — Reduce Roles + CTA Button + Aria-Live

**Files:**
- Modify: `src/components/Landing.tsx`
- Modify: `src/components/styles/Landing.css`

- [ ] **Step 1: Update Landing.tsx**

```tsx
import { PropsWithChildren, useCallback } from "react";
import { useSmoother } from "../context/SmootherContext";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const smootherRef = useSmoother();

  const handleCTA = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (window.innerWidth > 1024 && smootherRef.current) {
        e.preventDefault();
        smootherRef.current.scrollTo("#work", true, "top top");
      }
    },
    [smootherRef]
  );

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANUJ
              <br />
              <span>BANSAL</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2
              className="landing-info-h2"
              aria-live="polite"
              role="status"
            >
              <div className="landing-h2-1">Data Scientist</div>
              <div className="landing-h2-2">ML Engineer</div>
              <div className="landing-h2-3">Data Analyst</div>
            </h2>
            <div className="landing-award">
              <span>3rd Place, Graduate Poster — ASEE NE 2026</span>
            </div>
            <a
              href="#work"
              className="landing-cta"
              onClick={handleCTA}
              data-cursor="disable"
            >
              View My Work ↓
            </a>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
```

- [ ] **Step 2: Add CTA styles to Landing.css**

Append to `src/components/styles/Landing.css`:

```css
.landing-cta {
  display: inline-block;
  margin-top: 28px;
  padding: 12px 32px;
  border: 1px solid var(--accentColor);
  border-radius: 30px;
  color: var(--accentColor);
  font-size: 15px;
  font-weight: 500;
  font-family: "Geist", sans-serif;
  letter-spacing: 0.5px;
  text-decoration: none;
  background: transparent;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.landing-cta:hover {
  background: rgba(94, 234, 212, 0.12);
  box-shadow: 0 0 20px rgba(94, 234, 212, 0.15);
}
```

- [ ] **Step 3: Remove old role divs CSS positions for removed roles**

The `.landing-h2-4`, `.landing-h2-5`, `.landing-h2-6` selectors in CSS can remain (they just won't match anything). No CSS change needed.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Landing.tsx src/components/styles/Landing.css
git commit -m "feat(landing): reduce roles to 3, add CTA button, add aria-live"
```

---

### Task 5: About Section — Add Metrics Row

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/styles/About.css`

- [ ] **Step 1: Update About.tsx with metrics**

```tsx
import "./styles/About.css";

const metrics = [
  { value: "4+", label: "Years Experience" },
  { value: "10", label: "Projects" },
  { value: "16+", label: "Technologies" },
  { value: "1", label: "Award" },
];

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Engineering graduate turned data scientist with 4+ years of experience
          transforming raw data into decisions that move businesses forward.
          Currently pursuing MS Data Science at UMass Dartmouth while pioneering
          ML research in AFM Z-height map reconstruction using deep learning
          architectures. I build end-to-end ML pipelines, explainable AI systems,
          and interactive data applications that bridge the gap between complex
          models and real-world impact.
        </p>
        <div className="about-metrics">
          {metrics.map((m, i) => (
            <div className="about-metric" key={i}>
              <span className="about-metric-value">{m.value}</span>
              <span className="about-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
```

- [ ] **Step 2: Add metrics styles to About.css**

Append to `src/components/styles/About.css`:

```css
.about-metrics {
  display: flex;
  gap: 50px;
  margin-top: 50px;
  flex-wrap: wrap;
}

.about-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-metric-value {
  font-size: 48px;
  font-weight: 600;
  color: var(--accentColor);
  line-height: 1;
}

.about-metric-label {
  font-size: 14px;
  font-weight: 400;
  color: #adacac;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media only screen and (max-width: 600px) {
  .about-metrics {
    gap: 30px;
  }

  .about-metric-value {
    font-size: 36px;
  }

  .about-metric-label {
    font-size: 12px;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx src/components/styles/About.css
git commit -m "feat(about): add metrics row (years, projects, tech, award)"
```

---

### Task 6: Carousel — Touch Swipe + Keyboard Nav + Project Links

**Files:**
- Modify: `src/components/Work.tsx`

- [ ] **Step 1: Add touch swipe and keyboard nav to Work component**

Add the following inside the `Work` component, after existing state declarations:

```tsx
// Touch swipe state
const pointerStart = useRef<{ x: number; y: number } | null>(null);
const trackRef = useRef<HTMLDivElement>(null);

const handlePointerDown = useCallback((e: React.PointerEvent) => {
  pointerStart.current = { x: e.clientX, y: e.clientY };
}, []);

const handlePointerUp = useCallback(
  (e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const deltaX = e.clientX - pointerStart.current.x;
    const deltaY = e.clientY - pointerStart.current.y;
    pointerStart.current = null;

    // Only trigger if horizontal swipe > 50px and more horizontal than vertical
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goToNext();
      else goToPrev();
    }
  },
  [goToNext, goToPrev]
);

// Keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const workEl = document.getElementById("work");
    if (!workEl) return;
    const rect = workEl.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [goToPrev, goToNext]);
```

Then add pointer events to `carousel-track-container`:

```tsx
<div
  className="carousel-track-container"
  onPointerDown={handlePointerDown}
  onPointerUp={handlePointerUp}
  ref={trackRef}
>
```

- [ ] **Step 2: Add project links to Project interface and data**

Add to interface:

```tsx
interface Project {
  // ... existing fields
  githubUrl?: string;
  liveUrl?: string;
}
```

Add URLs to projects (example for first 3):

```tsx
// Project 1
githubUrl: "https://github.com/99anujb",

// Project 2
githubUrl: "https://github.com/99anujb",

// Project 3
githubUrl: "https://github.com/99anujb",
```

Add link rendering in carousel-details, after carousel-meta div:

```tsx
{(project.githubUrl || project.liveUrl) && (
  <div className="carousel-links">
    {project.githubUrl && (
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
        onClick={(e) => e.stopPropagation()}
        className="carousel-link"
      >
        GitHub ↗
      </a>
    )}
    {project.liveUrl && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
        onClick={(e) => e.stopPropagation()}
        className="carousel-link"
      >
        Live Demo ↗
      </a>
    )}
  </div>
)}
```

- [ ] **Step 3: Add carousel link styles to Work.css**

Append to `src/components/styles/Work.css`:

```css
.carousel-links {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.carousel-link {
  font-size: 13px;
  color: var(--accentColor);
  border: 1px solid rgba(94, 234, 212, 0.3);
  padding: 4px 12px;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.carousel-link:hover {
  background: rgba(94, 234, 212, 0.12);
  border-color: var(--accentColor);
}
```

- [ ] **Step 4: Add aria attributes to carousel**

On `carousel-wrapper`:
```tsx
<div className="carousel-wrapper" role="region" aria-roledescription="carousel" aria-label="Project showcase">
```

On each `carousel-slide`:
```tsx
<div className="carousel-slide" key={project.id} role="group" aria-roledescription="slide" aria-label={`Project ${project.id}: ${project.title}`}>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/Work.tsx src/components/styles/Work.css
git commit -m "feat(carousel): add touch swipe, keyboard nav, project links, aria attrs"
```

---

### Task 7: Career — ScrollTrigger Stagger Animations

**Files:**
- Modify: `src/components/Career.tsx`

- [ ] **Step 1: Add ScrollTrigger animation to Career**

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Career.css";

gsap.registerPlugin(ScrollTrigger);

const Career = () => {
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infoRef.current) return;
    const boxes = infoRef.current.querySelectorAll(".career-info-box");
    gsap.fromTo(
      boxes,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info" ref={infoRef}>
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>ML Researcher</h4>
                <h5>AFM Z-Height Project</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Two-stage deep learning pipeline reconstructing AFM height maps.
              ResNet18 + Attention U-Net achieving 92.7% median recovery and 0.80 nm MAE.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MS Data Science</h4>
                <h5>UMass Dartmouth</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Deep diving into machine learning, deep learning, and the
              mathematics behind intelligent systems. GPA: 3.6
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Business Dev</h4>
                <h5>EdTech Industry</h5>
              </div>
              <h3>2020–23</h3>
            </div>
            <p>
              Built predictive models for lead scoring, ran A/B tests, and
              discovered that data was the real lever behind every business
              decision.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech Mech Eng.</h4>
                <h5>Punjab Technical University</h5>
              </div>
              <h3>2016–20</h3>
            </div>
            <p>
              Learned systems thinking, process optimization, and precision
              problem-solving. Built the engineering mindset that now drives
              data work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Career.tsx
git commit -m "feat(career): add ScrollTrigger stagger reveal animation"
```

---

### Task 8: Contact Form (Formspree)

**Files:**
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/styles/Contact.css`

- [ ] **Step 1: Add contact form to Contact.tsx**

Add a new contact-box with form after existing boxes. Add state imports and form handler:

```tsx
import { useState, FormEvent } from "react";
import { MdArrowOutward, MdCopyright, MdDescription } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xpwzgkdo", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setFormState("sent");
        form.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a href="mailto:99anujbansal@gmail.com" data-cursor="disable">
                99anujbansal@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+15089652806" data-cursor="disable">
                (508) 965-2806
              </a>
            </p>
            <h4>Education</h4>
            <p>MS Data Science, UMass Dartmouth — 2024–Present (GPA: 3.6)</p>
            <p>B.Tech Mechanical Engineering, Punjab Technical University — 2016–2020</p>
            <h4>Location</h4>
            <p>Boston · New York · Texas · Remote</p>
            <h4>Resumes</h4>
            <a
              href="https://drive.google.com/drive/folders/1WAQVRc-gTyEjBhdDnthiCjIihxO6FtXD?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="resume-button"
            >
              <MdDescription /> View My Resumes
            </a>
            <p className="resume-helper">
              Download role-specific resumes for Data Scientist, Data Analyst,
              Business Analyst, Data Engineer, ML Engineer, and Finance Analyst positions
            </p>
          </div>
          <div className="contact-box">
            <h4>Send a Message</h4>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                data-cursor="disable"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                data-cursor="disable"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                required
                data-cursor="disable"
              />
              <button
                type="submit"
                disabled={formState === "sending"}
                data-cursor="disable"
                className="contact-submit"
              >
                {formState === "sending" ? "Sending..." : "Send Message"}
              </button>
              {formState === "sent" && (
                <p className="form-feedback form-success">Message sent!</p>
              )}
              {formState === "error" && (
                <p className="form-feedback form-error">Something went wrong. Try again.</p>
              )}
            </form>
            <h4 style={{ marginTop: "30px" }}>Social</h4>
            <a
              href="https://github.com/99anujb"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/anuj-bansal-854772189"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="mailto:99anujbansal@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Anuj Bansal</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
```

Note: Replace `xpwzgkdo` with user's actual Formspree form ID. User needs to sign up at formspree.io and create a form.

- [ ] **Step 2: Add form styles to Contact.css**

Append to `src/components/styles/Contact.css`:

```css
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  max-width: 350px;
}

.contact-form input,
.contact-form textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 16px;
  color: #eae5ec;
  font-size: 14px;
  font-family: "Geist", sans-serif;
  outline: none;
  transition: border-color 0.2s ease;
  resize: vertical;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--accentColor);
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #6b7280;
}

.contact-submit {
  padding: 12px 24px;
  background: rgba(94, 234, 212, 0.1);
  border: 1px solid var(--accentColor);
  border-radius: 8px;
  color: var(--accentColor);
  font-size: 14px;
  font-weight: 500;
  font-family: "Geist", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.contact-submit:hover:not(:disabled) {
  background: rgba(94, 234, 212, 0.2);
  box-shadow: 0 0 20px rgba(94, 234, 212, 0.15);
}

.contact-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-feedback {
  font-size: 13px;
  margin: 4px 0 0;
}

.form-success {
  color: var(--accentColor);
}

.form-error {
  color: #ef4444;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.tsx src/components/styles/Contact.css
git commit -m "feat(contact): add contact form with Formspree integration"
```

---

### Task 9: Accessibility — Cursor, Focus, Skip Nav

**Files:**
- Modify: `src/components/styles/Cursor.css`
- Modify: `src/index.css`
- Modify: `src/components/MainContainer.tsx`

- [ ] **Step 1: Hide custom cursor on touch devices**

Append to `src/components/styles/Cursor.css`:

```css
@media (pointer: coarse) {
  .cursor-main {
    display: none !important;
  }
}
```

- [ ] **Step 2: Add focus-visible styles and skip-nav to index.css**

Append to `src/index.css`:

```css
/* Skip to content link */
.skip-nav {
  position: fixed;
  top: -100px;
  left: 16px;
  z-index: 9999;
  padding: 12px 24px;
  background: var(--accentColor);
  color: #0a0e17;
  font-weight: 600;
  font-size: 14px;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-nav:focus {
  top: 0;
}

/* Global focus-visible */
*:focus-visible {
  outline: 2px solid var(--accentColor);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accentColor);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Add skip-nav link to MainContainer**

At the top of the return in MainContainer.tsx, before `<Cursor />`:

```tsx
<a href="#about" className="skip-nav">Skip to content</a>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/styles/Cursor.css src/index.css src/components/MainContainer.tsx
git commit -m "feat(a11y): hide cursor on touch, focus-visible styles, skip-nav link"
```

---

### Task 10: Vercel Analytics

**Files:**
- Modify: `package.json`
- Modify: `src/App.tsx`

- [ ] **Step 1: Install @vercel/analytics**

Run: `npm install @vercel/analytics`
Expected: Package installs successfully.

- [ ] **Step 2: Add Analytics to App.tsx**

Add import and component:

```tsx
import { Analytics } from "@vercel/analytics/react";
```

Add `<Analytics />` inside the fragment, after `</LoadingProvider>`:

```tsx
const App = () => {
  return (
    <>
      <LoadingProvider>
        <SmootherProvider>
          <Suspense>
            <MainContainer>
              <Suspense>
                <CharacterModel />
              </Suspense>
            </MainContainer>
          </Suspense>
        </SmootherProvider>
      </LoadingProvider>
      <Analytics />
    </>
  );
};
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/App.tsx
git commit -m "feat: add Vercel Analytics"
```

---

## Summary

| Task | Description | Est. files changed |
|------|-------------|-------------------|
| 1 | SEO structured data + sitemap | 3 |
| 2 | SmootherContext refactor | 4 |
| 3 | TechStack perf | 1 |
| 4 | Landing CTA + roles + a11y | 2 |
| 5 | About metrics | 2 |
| 6 | Carousel swipe + keys + links | 2 |
| 7 | Career animations | 1 |
| 8 | Contact form | 2 |
| 9 | Accessibility | 3 |
| 10 | Analytics | 2 |

Total: 10 tasks, ~22 file changes.
