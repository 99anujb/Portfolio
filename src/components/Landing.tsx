import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
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
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Data Scientist</div>
              <div className="landing-h2-2">Data Analyst</div>
              <div className="landing-h2-3">Business Analyst</div>
              <div className="landing-h2-4">Data Engineer</div>
              <div className="landing-h2-5">Machine Learning Engineer</div>
              <div className="landing-h2-6">Finance Analyst</div>
            </h2>
            <div className="landing-award">
              <span>3rd Place, Graduate Poster — ASEE NE 2026</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
