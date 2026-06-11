import "./styles/About.css";

const metrics = [
  { value: "4+", label: "Years Experience" },
  { value: "12", label: "Projects" },
  { value: "18+", label: "Technologies" },
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
          architectures. From SQL and Tableau dashboards that tell a business
          story to end-to-end ML pipelines and explainable AI systems, I bridge
          the gap between complex models and real-world impact.
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
