import { useEffect, useRef, useState } from "react";
import "./styles/About.css";

const metrics = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 12, suffix: "", label: "Projects" },
  { value: 18, suffix: "+", label: "Technologies" },
  { value: 1, suffix: "", label: "Award" },
];

const About = () => {
  const metricsRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(metrics.map(() => 0));

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCounts(metrics.map((m) => Math.round(m.value * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Engineering graduate turned data scientist with 4+ years of experience
          transforming raw data into decisions that move businesses forward.
          I completed my MS in Data Science at UMass Dartmouth in May 2026,
          where I pioneered award-winning ML research in AFM Z-height map
          reconstruction using deep learning architectures. From SQL and
          Tableau dashboards that tell a business story to end-to-end ML
          pipelines and explainable AI systems, I bridge the gap between
          complex models and real-world impact.
        </p>
        <div className="about-metrics" ref={metricsRef}>
          {metrics.map((m, i) => (
            <div className="about-metric" key={i}>
              <span className="about-metric-value">
                {counts[i]}
                {m.suffix}
              </span>
              <span className="about-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
