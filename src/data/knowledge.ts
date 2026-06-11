// Shared knowledge base about Anuj — used by the Ask-AJ chatbot
// (serverless system prompt + client-side fallback answers).

export const PROFILE_SUMMARY = `
Anuj Bansal — Data Scientist & Analyst.
Education: MS Data Science at UMass Dartmouth (2024–present, GPA 3.6); B.Tech Mechanical Engineering, Punjab Technical University (2016–2020).
Experience: 4+ years. ML Researcher on AFM Z-Height reconstruction (now); Business Development in EdTech (2020–23) building lead-scoring models and A/B tests.
Award: 3rd Place, Graduate Poster Competition, ASEE Northeast Section Annual Conference 2026.
Currently open to Data Analyst, Business Analyst, and Data Scientist roles. Available immediately. Location: Boston / New York / Texas / Remote.
Contact: 99anujbansal@gmail.com · github.com/99anujb · linkedin.com/in/anuj-bansal-854772189 · Tableau Public: public.tableau.com/app/profile/anuj.bansal4965
Skills: Python, SQL, Tableau, scikit-learn, XGBoost, PyTorch, SHAP explainability, Streamlit, D3.js, Plotly, statistics, A/B testing, ETL, forecasting, CLV modeling.
`.trim();

export interface KnowledgeProject {
  title: string;
  summary: string;
  keywords: string[];
}

export const KNOWLEDGE_PROJECTS: KnowledgeProject[] = [
  {
    title: "AFM Z-Height Map Reconstruction",
    summary:
      "Award-winning deep learning research: two-stage ResNet18 + Attention U-Net pipeline (17.3M params) reconstructing AFM height maps from TIFF images — 92.7% median height recovery, 0.80 nm MAE. Presented at ASEE NE 2026, won 3rd place graduate poster.",
    keywords: ["deep learning", "research", "pytorch", "unet", "afm", "award", "asee"],
  },
  {
    title: "S&P 500 Sector Intelligence",
    summary:
      "Interactive Tableau dashboard on 619K daily records across 11 GICS sectors (2013–2018). Headline insights: Communication Services +138%, Energy −1.5% with highest volatility. Live on Tableau Public.",
    keywords: ["tableau", "finance", "stocks", "dashboard", "business analyst", "sp500", "s&p"],
  },
  {
    title: "ChurnShield AI",
    summary:
      "Telecom churn prediction on 7,043 records: Optuna-tuned XGBoost, 0.8493 ROC-AUC, recall lifted 53%→76%. K-Means segmentation, Kaplan-Meier survival analysis, CLV modeling, $262K missed-revenue diagnosis, Streamlit dashboard.",
    keywords: ["churn", "xgboost", "shap", "segmentation", "clv", "survival", "telecom"],
  },
  {
    title: "Stock Price Prediction Dashboard (StockSense)",
    summary:
      "Real-time ML dashboard pulling live market data via Alpaca API, predicting next-day closes for 5 major US stocks at ~1–2% MAE with Random Forest, SHAP explanations per prediction.",
    keywords: ["stock", "finance", "random forest", "alpaca", "real-time", "prediction"],
  },
  {
    title: "Hybrid Music Recommendation System",
    summary:
      "Hybrid recommender on 93,185 Spotify tracks combining content-based KNN (cosine similarity) with XGBoost-predicted popularity. Interactive mood/tempo/era preference interface.",
    keywords: ["music", "recommender", "spotify", "knn", "recommendation"],
  },
  {
    title: "Zomato Restaurant Rating Prediction",
    summary:
      "End-to-end ML pipeline on 71,730 Zomato Bengaluru records, Extra Trees Regressor deployed as a Flask web app with full HLD/LLD design docs.",
    keywords: ["zomato", "restaurant", "flask", "deployment", "regression"],
  },
  {
    title: "Sustainable Fashion Visual Analytics",
    summary:
      "Pure D3.js v7 dashboard analyzing 5,000 fashion brand records across 10 countries (2010–2024): choropleth maps, animated year playback, country drill-downs. Zero build tools.",
    keywords: ["d3", "visualization", "fashion", "choropleth", "map"],
  },
  {
    title: "Declassified Document Explorer",
    summary:
      "Interactive browser for 111 declassified intelligence summaries from 5 US agencies — Pandas ETL, real-time search, drag-and-drop multi-document workspace.",
    keywords: ["documents", "cia", "fbi", "d3", "search", "etl"],
  },
  {
    title: "Disease Risk Prediction",
    summary:
      "Multi-disease risk scoring with stacking ensembles, calibrated probabilities, SHAP explainability, and a Streamlit clinical decision-support interface.",
    keywords: ["healthcare", "disease", "risk", "clinical", "ensemble"],
  },
  {
    title: "LinkedIn Auto-Post Agent",
    summary:
      "Autonomous content agent: Claude drafts a daily LinkedIn post, attaches Unsplash imagery, and emails it for one-tap publishing — zero-server GitHub Actions cron deployment.",
    keywords: ["linkedin", "agent", "claude", "automation", "ai agent", "github actions"],
  },
];

export function localAnswer(question: string): string {
  const q = question.toLowerCase();

  const matched = KNOWLEDGE_PROJECTS.filter((p) =>
    p.keywords.some((k) => q.includes(k))
  );
  if (matched.length > 0) {
    return matched
      .slice(0, 2)
      .map((p) => `**${p.title}** — ${p.summary}`)
      .join("\n\n");
  }

  if (/contact|email|reach|hire|phone/.test(q)) {
    return "You can reach Anuj at 99anujbansal@gmail.com, on LinkedIn (linkedin.com/in/anuj-bansal-854772189), or through the contact form below. He's open to Data Analyst, Business Analyst, and Data Scientist roles — available immediately.";
  }
  if (/education|degree|school|university|study/.test(q)) {
    return "Anuj is completing an MS in Data Science at UMass Dartmouth (2024–present, GPA 3.6) and holds a B.Tech in Mechanical Engineering from Punjab Technical University (2016–2020).";
  }
  if (/experience|work|job|career|background/.test(q)) {
    return "4+ years of experience: currently an ML Researcher on AFM Z-height reconstruction (award-winning deep learning research), previously Business Development in EdTech (2020–23) where he built lead-scoring models and ran A/B tests.";
  }
  if (/skill|tool|tech|stack|know/.test(q)) {
    return "Core stack: Python, SQL, Tableau, scikit-learn, XGBoost, PyTorch, SHAP, Streamlit, D3.js, Plotly. Strong in statistics, A/B testing, ETL pipelines, forecasting, and CLV modeling.";
  }
  if (/award|achievement|win|prize/.test(q)) {
    return "Anuj won 3rd Place in the Graduate Student Poster Competition at the ASEE Northeast Section Annual Conference 2026, for his AFM height-map reconstruction research.";
  }
  if (/project/.test(q)) {
    return (
      "Anuj has 12 projects spanning ML, analytics, and AI agents. Highlights:\n\n" +
      KNOWLEDGE_PROJECTS.slice(0, 4)
        .map((p) => `**${p.title}** — ${p.summary}`)
        .join("\n\n")
    );
  }

  return "I can tell you about Anuj's projects, skills, experience, education, or how to contact him. Try asking something like \"Has Anuj built churn models?\" or \"What's his Tableau work?\"";
}
