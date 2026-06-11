import Marquee from "react-fast-marquee";
import "./styles/SkillsMarquee.css";

const skills = [
  "Python",
  "SQL",
  "Tableau",
  "Machine Learning",
  "Deep Learning",
  "Statistics",
  "XGBoost",
  "PyTorch",
  "Streamlit",
  "D3.js",
  "ETL Pipelines",
  "Explainable AI",
  "Forecasting",
  "A/B Testing",
];

const SkillsMarquee = () => {
  return (
    <div className="skills-marquee" aria-hidden="true">
      <Marquee speed={55} autoFill gradient={false}>
        {skills.map((skill, i) => (
          <span
            className={`marquee-item ${i % 2 === 1 ? "marquee-outline" : ""}`}
            key={skill}
          >
            {skill}
            <span className="marquee-star">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default SkillsMarquee;
