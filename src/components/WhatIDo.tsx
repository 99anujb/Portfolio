import "./styles/WhatIDo.css";
import {
  MdBarChart,
  MdCloud,
  MdStorage,
  MdTrendingUp,
  MdBubbleChart,
  MdMemory,
} from "react-icons/md";
import { IconType } from "react-icons";

interface Capability {
  icon: IconType;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

const capabilities: Capability[] = [
  {
    icon: MdMemory,
    title: "DATA SCIENCE & ML",
    subtitle: "Building Intelligent Systems",
    description:
      "End-to-end ML pipelines from data wrangling to deployment with deep learning and explainable AI.",
    tags: ["PyTorch", "scikit-learn", "XGBoost", "Deep Learning"],
  },
  {
    icon: MdBarChart,
    title: "DATA ANALYTICS & BI",
    subtitle: "Turning Data into Decisions",
    description:
      "Statistical analysis, interactive dashboards, and data-driven insights for business decisions.",
    tags: ["SQL", "Tableau", "Python", "Dashboards"],
  },
  {
    icon: MdCloud,
    title: "ML ENGINEERING",
    subtitle: "Models to Production",
    description:
      "Model deployment, API development, and production-grade ML serving infrastructure.",
    tags: ["Flask", "Streamlit", "Model Serving", "APIs"],
  },
  {
    icon: MdStorage,
    title: "DATA ENGINEERING",
    subtitle: "Pipelines & Infrastructure",
    description:
      "ETL pipelines, SQL optimization, API integration, and automated data workflows.",
    tags: ["ETL", "SQL Optimization", "API Integration", "Automation"],
  },
  {
    icon: MdTrendingUp,
    title: "BUSINESS & FINANCE",
    subtitle: "Strategic Analytics",
    description:
      "Forecasting, customer lifetime value, strategic analysis, and KPI tracking.",
    tags: ["Forecasting", "CLV", "Strategic Analysis", "KPI Tracking"],
  },
  {
    icon: MdBubbleChart,
    title: "DATA VISUALIZATION",
    subtitle: "Storytelling with Data",
    description:
      "Interactive dashboards, compelling visualizations, and data storytelling that drives action.",
    tags: ["D3.js", "Plotly", "Interactive Dashboards"],
  },
];

const WhatIDo = () => {
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          {capabilities.map((cap, index) => (
            <div className="what-content" key={index}>
              <div className="what-content-in">
                <div className="what-icon">
                  <cap.icon />
                </div>
                <h3>{cap.title}</h3>
                <h4>{cap.subtitle}</h4>
                <p>{cap.description}</p>
                <div className="what-content-flex">
                  {cap.tags.map((tag, i) => (
                    <div className="what-tags" key={i}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
