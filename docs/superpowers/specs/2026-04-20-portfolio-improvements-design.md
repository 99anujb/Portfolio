# Portfolio Advanced Improvements — Design Spec

## Overview

Comprehensive upgrade to Anuj Bansal's portfolio site across SEO, performance, UX, accessibility, and code quality. Three phases, implemented in priority order.

## Phase 1: Foundation (SEO + Performance + Code Quality)

### 1.1 SEO & Meta

- **index.html**: Add `<title>`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Card meta
- **Structured data**: JSON-LD `Person` schema with name, role, links
- **robots.txt** + **sitemap.xml** in `public/`
- **Prerendering**: Install `vite-plugin-prerender`, configure routes (`/`) so crawlers see rendered HTML

### 1.2 Performance

- **TechStack lazy mount**: Wrap Canvas in IntersectionObserver — only render when section is within 200px of viewport
- **Mobile sphere reduction**: Detect `window.innerWidth < 768` → reduce from 30 to 12 spheres
- **DPR cap**: `gl={{ ...existing, pixelRatio: Math.min(window.devicePixelRatio, 2) }}`
- **Texture deferral**: Move `createTechTexture` calls from module-level into `useMemo` inside component
- **Code split TechStack**: `React.lazy(() => import('./TechStack'))` — separate chunk for Three.js + Rapier

### 1.3 Code Quality

- **ScrollSmoother context**: Create `SmootherContext` provider, replace module-level `export let smoother`
- **React event handlers**: Remove `querySelectorAll` + `addEventListener` in Navbar useEffect, use `onClick` props on `<a>` elements
- **Null safety**: Replace `getElementById("work")!` with optional chaining + early return
- **TechStack scroll**: Replace `setInterval` hack with GSAP `ScrollTrigger.create()` for activation

## Phase 2: UX Features

### 2.1 Carousel Enhancements

- **Touch swipe**: Add `onPointerDown`/`onPointerMove`/`onPointerUp` handlers. Threshold: 50px horizontal delta triggers prev/next
- **Keyboard nav**: `useEffect` with `keydown` listener — ArrowLeft/ArrowRight when carousel section in view
- **Transition**: Add CSS `transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)` (already works via inline style)

### 2.2 Landing Section

- **Reduce roles**: Keep only "Data Scientist", "ML Engineer", "Data Analyst" (remove Business Analyst, Data Engineer, Finance Analyst)
- **CTA button**: Add below role cycling — "View My Work ↓" button that smooth-scrolls to #work section
- **Style**: Ghost button with teal border, hover fill animation

### 2.3 About Section Metrics

- Add stats row below paragraph:
  - "4+" years experience
  - "10" projects completed
  - "16+" technologies
  - "1" award
- Style: flexbox row, large number + small label, teal accent on numbers

### 2.4 Contact Form

- **Provider**: Formspree (free tier, no backend needed)
- **Fields**: Name, Email, Message (all required)
- **Placement**: New box in contact-flex grid
- **Validation**: HTML5 required + basic email pattern
- **Feedback**: Success/error message state

### 2.5 Career Animations

- Each `.career-info-box` gets `ScrollTrigger` with stagger
- Animation: `opacity: 0, y: 40` → `opacity: 1, y: 0`, stagger 0.2s
- Trigger: `top 80%` of viewport

## Phase 3: Polish

### 3.1 Accessibility

- **Landing role cycling**: Add `aria-live="polite"` + `role="status"` on cycling container
- **Carousel**: `aria-roledescription="carousel"`, `aria-label` on slides
- **Custom cursor**: Add `@media (pointer: coarse) { .cursor { display: none } }` and restore default cursor
- **Focus indicators**: Add `:focus-visible` styles on all interactive elements (2px teal outline)
- **Skip nav**: Add hidden "Skip to content" link before header

### 3.2 Project Links

- Add `githubUrl` and `liveUrl` optional fields to Project interface
- Populate with actual GitHub repo URLs (user will provide)
- Render as icon buttons in carousel card + modal

### 3.3 Analytics

- Install `@vercel/analytics`
- Add `<Analytics />` component in App.tsx
- Zero config — works automatically on Vercel deployment

## Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Prerender tool | vite-plugin-prerender | Vite-native, no framework change needed |
| Contact form | Formspree | Free, no backend, simple POST |
| Analytics | Vercel Analytics | Already deployed on Vercel, zero config |
| Touch gestures | Pointer Events API | Works for both touch and mouse, no library needed |
| Scroll animations | GSAP ScrollTrigger | Already in project, no new dependency |

## Out of Scope

- Dark/light mode toggle (dark-only is intentional brand choice)
- Blog section (future iteration)
- Testimonials (requires content from user)
- Full rewrite of Character system

## Success Criteria

- Lighthouse Performance score > 85
- All meta tags render for crawlers (test with `curl`)
- Carousel works with swipe on mobile
- Contact form successfully sends emails
- No accessibility errors in axe DevTools scan
- Site loads without JS errors on mobile Safari + Chrome
