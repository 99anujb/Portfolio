import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./styles/Work.css";
import { MdArrowBack, MdArrowForward, MdClose } from "react-icons/md";
import { useSmoother } from "../context/SmootherContext";

interface Project {
  id: number;
  title: string;
  category: string;
  domainTags: string[];
  tools: string[];
  status: "Completed" | "In Progress";
  shortDescription: string;
  caseStudyHighlights: string[];
  award?: string;
  canvasVisualizationType: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AFM Z-Height Map Reconstruction",
    category: "Deep Learning / Research",
    domainTags: ["Deep Learning", "Data Science"],
    tools: [
      "PyTorch",
      "Attention U-Net",
      "ResNet18",
      "Custom Loss Functions",
      "Python",
    ],
    status: "Completed",
    shortDescription:
      "Two-stage deep learning pipeline (ResNet18 + Attention U-Net, 17.3M params) reconstructing AFM height maps from TIFF images. Achieved 92.7% median height recovery and 0.80 nm MAE.",
    caseStudyHighlights: [
      "Processed 79 original frosted glass AFM scans augmented to 474 training pairs across 7 scan sizes (1, 5, 10, 20, 40, 60, 80 \u03bcm\u00b2).",
      "Engineered a custom AFMLoss composite loss function (0.6\u00b7L1 + 0.3\u00b7Std + 0.1\u00b7Range).",
      "Implemented group-based anti-leakage 80/10/10 splits.",
      "Built production inference pipeline outputting XYZ.txt files with Ra/Rq/Rz roughness metrics.",
      "Presented at ASEE NE 2026 at Southern New Hampshire University.",
      "Won 3rd Place in the Graduate Student Poster Competition.",
    ],
    award:
      "3rd Place, Graduate Poster, ASEE Northeast Section Annual Conference 2026",
    canvasVisualizationType: "heatmap",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 2,
    title: "ChurnShield AI",
    category: "Machine Learning / Business Analytics",
    domainTags: ["Machine Learning", "Business Analytics", "Data Science"],
    tools: [
      "XGBoost",
      "Optuna",
      "SHAP",
      "K-Means",
      "Lifelines",
      "Streamlit",
      "Plotly",
      "Python",
    ],
    status: "Completed",
    shortDescription:
      "Multi-analysis churn prediction system on 7,043 telecom records using Optuna-tuned XGBoost achieving 0.8493 ROC-AUC and 76% recall, with customer segmentation and CLV modeling.",
    caseStudyHighlights: [
      "Boosted churn recall from 53% to 76% (+43% relative improvement) via scale_pos_weight and 5 new engineered features (35 total).",
      "Applied K-Means clustering to identify 4 business-interpretable segments including a \"New High-Spender\" segment with 44% churn.",
      "Implemented Kaplan-Meier survival curves and Cox Proportional Hazards to predict time-to-churn.",
      "Diagnosed $262K in missed revenue from 381 \"quiet churners\" through systematic error analysis.",
      "Deployed a production Streamlit + Plotly dashboard with 3D scatter plots, radar charts, and survival curves.",
    ],
    canvasVisualizationType: "bar-chart",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 3,
    title: "Stock Price Prediction Dashboard",
    category: "Machine Learning / FinTech",
    domainTags: ["Machine Learning", "Finance", "Data Science"],
    tools: [
      "Random Forest",
      "SHAP",
      "Alpaca Markets API",
      "Streamlit",
      "Plotly",
      "Python",
    ],
    status: "Completed",
    shortDescription:
      "Real-time ML dashboard fetching live market data via Alpaca API and predicting next-day closing prices for 5 major US stocks with ~1-2% MAE using Random Forest.",
    caseStudyHighlights: [
      "Designed automated data pipeline fetching historical data from 2022 to present via Alpaca Markets API.",
      "Engineered 14 normalized technical indicators (RSI, SMA crossovers, momentum, volatility, volume change).",
      "Model: Random Forest Regressor (300 trees, max depth 10) predicting next-day percentage returns.",
      "Integrated SHAP explainability per prediction with plain-English top-3 driver summaries.",
      "Deployed Streamlit dashboard with candlestick charts, SMA overlays, RSI gauges, and backtest visualizations.",
    ],
    canvasVisualizationType: "candlestick",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 4,
    title: "Hybrid Music Recommendation System",
    category: "Machine Learning / Recommendation Systems",
    domainTags: ["Machine Learning", "Data Science"],
    tools: [
      "XGBoost",
      "Random Forest",
      "scikit-learn",
      "Pandas",
      "Jupyter",
    ],
    status: "Completed",
    shortDescription:
      "Hybrid music recommendation system combining content-based filtering with ML-predicted popularity scores on 93,185 Spotify tracks, featuring an interactive preference system.",
    caseStudyHighlights: [
      "Cleaned Spotify dataset from 169,907 raw tracks down to 93,185 cleaned records (1921-2020, 19 features).",
      "Trained XGBoost achieving RMSE 8.48, MAE 6.67, R\u00b2 0.474, and 74% classification accuracy.",
      "Built content-based recommender using KNN with cosine similarity on 9-dimensional audio feature space.",
      "Implemented hybrid scoring: final_score = 0.7 * (predicted_popularity / 100) + 0.3 * (1 - cosine_distance).",
      "Added interactive preference-based interface letting users specify mood, tempo, danceability, era, and style.",
    ],
    canvasVisualizationType: "waveform",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 5,
    title: "Zomato Restaurant Rating Prediction",
    category: "Machine Learning / Deployment",
    domainTags: ["Machine Learning", "Business Analytics", "Data Science"],
    tools: ["scikit-learn", "Flask", "Pandas", "Matplotlib", "HTML/CSS"],
    status: "Completed",
    shortDescription:
      "End-to-end ML pipeline predicting restaurant ratings from 71,730 raw Zomato Bengaluru records, deployed via Flask web app with Extra Trees Regressor.",
    caseStudyHighlights: [
      "Raw dataset of 71,730 records cleaned to 23,248 after handling duplicates, missing values, and data type conversions.",
      "Engineered 8 final features: online_order, book_table, votes, location, rest_type, cuisines, cost, menu_item.",
      "Compared Linear Regression, Random Forest, and Extra Trees Regressor \u2014 Extra Trees (n_estimators=120) achieved highest R\u00b2.",
      "Serialized model with Pickle and built Flask web application with HTML form for real-time predictions.",
      "Included full design documentation (HLD, LLD, Architecture, Wireframes).",
    ],
    canvasVisualizationType: "distribution",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 6,
    title: "Sustainable Fashion Visual Analytics",
    category: "Data Visualization / Interactive Dashboards",
    domainTags: ["Data Visualization"],
    tools: ["D3.js v7", "TopoJSON", "JavaScript", "HTML/CSS"],
    status: "Completed",
    shortDescription:
      "Interactive data visualization dashboard analyzing 5,000 fashion brand records across 10 countries (2010-2024) with choropleth maps and animated year playback.",
    caseStudyHighlights: [
      "Built v1.0 prototype and v1.2 full dashboard with Natural Earth projection and TopoJSON world boundaries.",
      "Implemented 4 selectable data metrics each with its own D3 color scale.",
      "Features: material filter, eco-friendly filter, year slider (2010-2024), animated playback (400ms/year).",
      "Click-to-zoom with 750ms transitions, hover tooltips, and zoom/pan scale extent [1, 8].",
      "Country drill-down pages with scatter plots, bar charts, multi-line trend charts, and network graphs.",
      "Built with zero build tools \u2014 pure D3 v7, TopoJSON v3, and vanilla JavaScript.",
    ],
    canvasVisualizationType: "bubble-chart",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 7,
    title: "Interactive Document Visualization Tool",
    category: "Data Visualization / Web Application",
    domainTags: ["Data Visualization"],
    tools: [
      "D3.js v7",
      "jQuery",
      "Sortable.js",
      "Python Pandas",
      "HTML/CSS",
    ],
    status: "Completed",
    shortDescription:
      "Web-based interactive document browser for 111 declassified intelligence summaries from 5 U.S. agencies, featuring real-time search and multi-document workspace.",
    caseStudyHighlights: [
      "Built Python Pandas ETL pipeline to extract 111 document summaries from 5 raw agency text files.",
      "Real-time keyword search filtering by Document ID, Agency, and content.",
      "Multi-document workspace with side-by-side comparison and drag-and-drop reordering via Sortable.js.",
      "Duplicate prevention logic with smooth fade-in/fade-out animations and hover scaling effects.",
      "Loaded JSON data via d3.json() and rendered via D3 data binding (selectAll \u2192 data \u2192 enter \u2192 append).",
    ],
    canvasVisualizationType: "document-grid",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 8,
    title: "Disease Risk Prediction",
    category: "Healthcare / Predictive Analytics",
    domainTags: ["Machine Learning", "Healthcare", "Data Science"],
    tools: ["scikit-learn", "XGBoost", "SHAP", "Streamlit"],
    status: "In Progress",
    shortDescription:
      "Healthcare predictive analytics tool for disease risk scoring using XGBoost and SHAP explainability, with a Streamlit interface for clinical decision support.",
    caseStudyHighlights: [
      "XGBoost-based risk scoring model with SHAP feature importance.",
      "Streamlit interface for clinical decision support.",
      "Multi-disease prediction capability.",
    ],
    canvasVisualizationType: "scatter-boundary",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 9,
    title: "Research Paper Summarizer & Job Match Agent",
    category: "AI Agents / NLP",
    domainTags: ["Machine Learning", "Data Science"],
    tools: ["LangChain", "OpenAI API", "Streamlit", "Python"],
    status: "In Progress",
    shortDescription:
      "AI agent that summarizes research papers and matches user resumes to relevant job listings using LangChain orchestration and OpenAI APIs.",
    caseStudyHighlights: [
      "LangChain-orchestrated multi-agent pipeline for document processing.",
      "Research paper summarization with key insight extraction.",
      "Resume-to-job matching using semantic similarity.",
    ],
    canvasVisualizationType: "network-flow",
    githubUrl: "https://github.com/99anujb",
  },
  {
    id: 10,
    title: "Financial Fraud Detection",
    category: "Anomaly Detection / Finance",
    domainTags: ["Deep Learning", "Finance"],
    tools: ["Isolation Forest", "Autoencoder", "Plotly", "Python"],
    status: "In Progress",
    shortDescription:
      "Anomaly detection system for financial transaction fraud using Isolation Forest and Autoencoder deep learning, with interactive Plotly visualizations.",
    caseStudyHighlights: [
      "Isolation Forest for unsupervised anomaly detection.",
      "Autoencoder deep learning for reconstruction-based fraud detection.",
      "Interactive Plotly visualizations for anomaly exploration.",
    ],
    canvasVisualizationType: "anomaly-scatter",
    githubUrl: "https://github.com/99anujb",
  },
];

const filterTags = [
  "All",
  "Data Science",
  "Machine Learning",
  "Business Analytics",
  "Data Visualization",
  "Deep Learning",
  "Finance",
  "Healthcare",
];

function generateProjectImage(index: number, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, w, h);

  // Subtle grid
  ctx.strokeStyle = "rgba(94, 234, 212, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const teal = "#5eead4";
  const orange = "#f97316";
  const purple = "#a78bfa";
  const blue = "#38bdf8";
  const pink = "#f472b6";
  const seed = index * 1337;
  const rng = (i: number) =>
    ((Math.sin(seed + i * 9301 + 49297) * 49297) % 1 + 1) % 1;

  switch (index) {
    case 0: {
      // AFM Z-Height Map - Heatmap
      const cols = 16,
        rows = 12;
      const cellW = (w - 60) / cols,
        cellH = (h - 60) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = rng(r * cols + c);
          const intensity = Math.floor(val * 255);
          ctx.fillStyle = `rgb(${Math.floor(intensity * 0.2)}, ${Math.floor(intensity * 0.8)}, ${Math.floor(intensity * 0.9)})`;
          ctx.fillRect(30 + c * cellW, 30 + r * cellH, cellW - 2, cellH - 2);
        }
      }
      ctx.fillStyle = "rgba(94, 234, 212, 0.8)";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Z-Height Map", 30, h - 10);
      break;
    }
    case 1: {
      // ChurnShield AI - Bar chart
      const bars = [0.85, 0.76, 0.72, 0.68, 0.88, 0.71, 0.45, 0.82];
      const labels = ["AUC", "Rec", "Prec", "F1", "Spec", "Acc", "FPR", "MCC"];
      const barW = (w - 80) / bars.length;
      bars.forEach((v, i) => {
        const barH = v * (h - 100);
        const gradient = ctx.createLinearGradient(0, h - 50 - barH, 0, h - 50);
        gradient.addColorStop(0, teal);
        gradient.addColorStop(1, "rgba(94, 234, 212, 0.2)");
        ctx.fillStyle = gradient;
        ctx.fillRect(40 + i * barW + 5, h - 50 - barH, barW - 10, barH);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], 40 + i * barW + barW / 2, h - 35);
      });
      ctx.textAlign = "left";
      ctx.fillStyle = teal;
      ctx.font = "bold 13px Arial";
      ctx.fillText("0.8493 ROC-AUC", 40, 30);
      break;
    }
    case 2: {
      // Stock Price Prediction - Candlestick chart
      const candles = 14;
      const candleW = (w - 80) / candles;
      // Moving average line
      const maPoints: [number, number][] = [];
      for (let i = 0; i < candles; i++) {
        const open = 0.3 + rng(i) * 0.35;
        const close = 0.3 + rng(i + 14) * 0.35;
        const high = Math.max(open, close) + rng(i + 28) * 0.12;
        const low = Math.min(open, close) - rng(i + 42) * 0.12;
        const isGreen = close > open;
        const color = isGreen ? "#22c55e" : "#ef4444";

        const x = 40 + i * candleW + candleW / 2;
        const bodyTop = h - 50 - Math.max(open, close) * (h - 100);
        const bodyBottom = h - 50 - Math.min(open, close) * (h - 100);
        const wickTop = h - 50 - high * (h - 100);
        const wickBottom = h - 50 - low * (h - 100);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, wickTop);
        ctx.lineTo(x, wickBottom);
        ctx.stroke();

        const bodyH = Math.max(bodyBottom - bodyTop, 2);
        ctx.fillStyle = color;
        ctx.fillRect(x - candleW * 0.3, bodyTop, candleW * 0.6, bodyH);

        maPoints.push([x, h - 50 - (0.38 + i * 0.015 + Math.sin(i / 3) * 0.04) * (h - 100)]);
      }
      ctx.strokeStyle = teal;
      ctx.lineWidth = 2;
      ctx.beginPath();
      maPoints.forEach(([px, py], i) =>
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      );
      ctx.stroke();
      ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
      ctx.font = "bold 13px Arial";
      ctx.fillText("AAPL +2.3%", 40, 25);
      break;
    }
    case 3: {
      // Hybrid Music Recommendation - Waveform + nodes
      const centerY = h / 2;
      for (let x = 30; x < w - 30; x += 3) {
        const t = (x - 30) / (w - 60);
        const amplitude =
          (20 + rng(x) * 50) * Math.sin(t * Math.PI) * (0.5 + 0.5 * Math.sin(t * 8));
        ctx.strokeStyle = teal;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, centerY - amplitude);
        ctx.lineTo(x, centerY + amplitude);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const nodes = [
        { x: w * 0.15, y: h * 0.2, r: 14, color: purple },
        { x: w * 0.5, y: h * 0.12, r: 11, color: blue },
        { x: w * 0.85, y: h * 0.22, r: 16, color: teal },
        { x: w * 0.3, y: h * 0.82, r: 13, color: orange },
        { x: w * 0.7, y: h * 0.85, r: 15, color: pink },
      ];
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      nodes.forEach((n) => {
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = purple;
      ctx.font = "bold 13px Arial";
      ctx.fillText("93K Tracks", 30, 25);
      break;
    }
    case 4: {
      // Zomato Rating - Distribution curve
      ctx.beginPath();
      ctx.moveTo(40, h - 60);
      const points: [number, number][] = [];
      for (let x = 0; x <= w - 80; x += 5) {
        const norm = x / (w - 80);
        const y = Math.exp(-Math.pow((norm - 0.65) * 4, 2)) * (h - 120);
        points.push([40 + x, h - 60 - y]);
        ctx.lineTo(40 + x, h - 60 - y);
      }
      ctx.lineTo(w - 40, h - 60);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(249, 115, 22, 0.6)");
      grad.addColorStop(1, "rgba(249, 115, 22, 0.05)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = orange;
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach(([px, py], i) =>
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      );
      ctx.stroke();
      ctx.fillStyle = orange;
      ctx.font = "bold 14px Arial";
      ctx.fillText("71.7K Records", 40, 40);
      break;
    }
    case 5: {
      // Sustainable Fashion - Bubble chart
      const bubbles = Array.from({ length: 20 }, (_, i) => ({
        x: 50 + rng(i) * (w - 100),
        y: 40 + rng(i + 20) * (h - 80),
        r: 10 + rng(i + 40) * 40,
        color: [teal, orange, purple, blue, pink][i % 5],
      }));
      bubbles.forEach((b) => {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      break;
    }
    case 6: {
      // Interactive Document Visualization - Document grid
      const cols = 6,
        rows = 4;
      const docW = (w - 60) / cols;
      const docH = (h - 60) / rows;
      const agencies = [teal, blue, purple, orange, pink];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x = 30 + c * docW;
          const y = 30 + r * docH;
          const agencyColor = agencies[idx % agencies.length];

          ctx.fillStyle = "rgba(255,255,255,0.03)";
          ctx.fillRect(x + 2, y + 2, docW - 4, docH - 4);
          ctx.strokeStyle = agencyColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.4;
          ctx.strokeRect(x + 2, y + 2, docW - 4, docH - 4);

          ctx.globalAlpha = 0.2;
          ctx.fillStyle = "#fff";
          for (let l = 0; l < 3; l++) {
            const lineW = (0.4 + rng(idx * 3 + l) * 0.4) * (docW - 12);
            ctx.fillRect(x + 6, y + 12 + l * 8, lineW, 3);
          }

          ctx.globalAlpha = 0.6;
          ctx.fillStyle = agencyColor;
          ctx.fillRect(x + 2, y + 2, docW - 4, 3);
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = blue;
      ctx.font = "bold 13px Arial";
      ctx.fillText("111 Documents \u00b7 5 Agencies", 30, h - 10);
      break;
    }
    case 7: {
      // Disease Risk Prediction - Scatter with decision boundary
      ctx.strokeStyle = "rgba(244, 114, 182, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      for (let x = 0; x < w; x += 5) {
        const y = h / 2 + Math.sin(x / 80) * 60 - 20;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 60; i++) {
        const x = 30 + rng(i) * (w - 60);
        const y = 30 + rng(i + 60) * (h - 60);
        const boundary = h / 2 + Math.sin(x / 80) * 60 - 20;
        ctx.fillStyle = y < boundary ? teal : pink;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = pink;
      ctx.font = "bold 13px Arial";
      ctx.fillText("Risk Classification", 30, 25);
      break;
    }
    case 8: {
      // Research Paper Summarizer - Network/flow diagram
      const flowNodes = [
        { x: 80, y: h / 2, label: "PDF", color: blue },
        { x: w / 2 - 40, y: h / 3, label: "NLP", color: purple },
        { x: w / 2 - 40, y: (2 * h) / 3, label: "LLM", color: teal },
        { x: w - 80, y: h / 3, label: "Summary", color: orange },
        { x: w - 80, y: (2 * h) / 3, label: "Match", color: pink },
      ];
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      (
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 4],
          [1, 4],
          [2, 3],
        ] as [number, number][]
      ).forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(flowNodes[a].x, flowNodes[a].y);
        ctx.lineTo(flowNodes[b].x, flowNodes[b].y);
        ctx.stroke();
      });
      flowNodes.forEach((n) => {
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + 4);
      });
      ctx.textAlign = "left";
      break;
    }
    case 9: {
      // Financial Fraud Detection - Anomaly scatter
      for (let i = 0; i < 100; i++) {
        const x = 40 + rng(i) * (w - 80);
        const y = 40 + rng(i + 100) * (h - 80);
        const isAnomaly = rng(i + 200) > 0.88;
        ctx.fillStyle = isAnomaly
          ? "#ef4444"
          : "rgba(94, 234, 212, 0.5)";
        ctx.globalAlpha = isAnomaly ? 0.9 : 0.4;
        const radius = isAnomaly ? 6 : 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        if (isAnomaly) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 13px Arial";
      ctx.fillText("\u25cf Anomalies Detected", 30, 25);
      break;
    }
  }

  // Border glow
  ctx.strokeStyle = "rgba(94, 234, 212, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, w, h);
}

function ProjectCanvas({ visualizationIndex }: { visualizationIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 500;
      canvasRef.current.height = 300;
      generateProjectImage(visualizationIndex, canvasRef.current);
    }
  }, [visualizationIndex]);

  return (
    <div className="work-image">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "450px",
          height: "auto",
          borderRadius: "8px",
          aspectRatio: "5 / 3",
        }}
      />
    </div>
  );
}

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const smootherRef = useSmoother();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    if (smootherRef.current) smootherRef.current.paused(true);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      if (smootherRef.current) smootherRef.current.paused(false);
    };
  }, [onClose, smootherRef]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          data-cursor="disable"
        >
          <MdClose />
        </button>

        {project.award && (
          <div className="modal-award">{project.award}</div>
        )}

        <h3 className="modal-title">{project.title}</h3>
        <p className="modal-category">{project.category}</p>

        <span
          className="modal-status"
          data-status={project.status === "Completed" ? "completed" : "in-progress"}
        >
          {project.status === "Completed"
            ? "\u25cf Completed"
            : "\u25cb In Progress"}
        </span>

        <p className="modal-description">{project.shortDescription}</p>

        <div className="modal-tools">
          <span className="modal-tools-label">Tools</span>
          <div className="modal-tools-list">
            {project.tools.map((tool, i) => (
              <span key={i} className="modal-tool-tag">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-case-study">
          <h4>Case Study</h4>
          <ul>
            {project.caseStudyHighlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
}

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.domainTags.includes(activeFilter));

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, filteredProjects.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === filteredProjects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, filteredProjects.length, goToSlide]);

  // Touch swipe state
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const deltaX = e.clientX - pointerStart.current.x;
      const deltaY = e.clientY - pointerStart.current.y;
      pointerStart.current = null;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) goToNext();
        else goToPrev();
      }
    },
    [goToNext, goToPrev]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const rect = workEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Selected <span>Work</span>
        </h2>

        <div className="filter-bar">
          {filterTags.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${activeFilter === tag ? "filter-tag-active" : ""}`}
              onClick={() => setActiveFilter(tag)}
              data-cursor="disable"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="carousel-wrapper" role="region" aria-roledescription="carousel" aria-label="Project showcase">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          <div
            className="carousel-track-container"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {filteredProjects.map((project) => (
                <div className="carousel-slide" key={project.id} role="group" aria-roledescription="slide" aria-label={`Project ${project.id}: ${project.title}`}>
                  <div className="carousel-content">
                    <div
                      className="carousel-info"
                      onClick={() => setModalProject(project)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="carousel-number">
                        <h3>{String(project.id).padStart(2, "0")}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools</span>
                          <p>{project.tools.join(", ")}</p>
                        </div>
                        <p className="carousel-description">
                          {project.shortDescription}
                        </p>
                        <div className="carousel-meta">
                          <span
                            className="carousel-status"
                            data-status={
                              project.status === "Completed"
                                ? "completed"
                                : "in-progress"
                            }
                          >
                            {project.status === "Completed"
                              ? "\u25cf Completed"
                              : "\u25cb In Progress"}
                          </span>
                          <span className="carousel-view-details">
                            View Case Study &rarr;
                          </span>
                        </div>
                        {(project.githubUrl || project.liveUrl) && (
                          <div className="carousel-links">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor="disable"
                                onClick={(e) => e.stopPropagation()}
                                className="carousel-link"
                              >
                                GitHub ↗
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor="disable"
                                onClick={(e) => e.stopPropagation()}
                                className="carousel-link"
                              >
                                Live Demo ↗
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <ProjectCanvas visualizationIndex={project.id - 1} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentIndex ? "carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>

      {modalProject && (
        <CaseStudyModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </div>
  );
};

export default Work;
