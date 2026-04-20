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
