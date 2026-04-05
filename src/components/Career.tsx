import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
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
