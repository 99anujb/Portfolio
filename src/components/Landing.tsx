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

  const handleMagnet = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.35}px)`;
    },
    []
  );

  const resetMagnet = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.transform = "";
    },
    []
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
              <div className="landing-h2-2">Business Analyst</div>
              <div className="landing-h2-3">Data Analyst</div>
            </h2>
            <div className="landing-status">
              <span className="landing-status-dot" aria-hidden="true" />
              <span>Open to Work — Data & Analytics Roles</span>
            </div>
            <div className="landing-award">
              <span>3rd Place, Graduate Poster — ASEE NE 2026</span>
            </div>
            <a
              href="#work"
              className="landing-cta"
              onClick={handleCTA}
              onMouseMove={handleMagnet}
              onMouseLeave={resetMagnet}
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
