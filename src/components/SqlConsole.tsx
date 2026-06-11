import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdTerminal } from "react-icons/md";
import "./styles/SqlConsole.css";

// Minimal sql.js typings (loaded lazily from CDN — keeps it out of the bundle)
interface SqlJsResult {
  columns: string[];
  values: (string | number | null)[][];
}

interface SqlJsDatabase {
  exec(sql: string): SqlJsResult[];
  run(sql: string): void;
}

interface SqlJsStatic {
  Database: new () => SqlJsDatabase;
}

declare global {
  interface Window {
    initSqlJs?: (config: {
      locateFile: (file: string) => string;
    }) => Promise<SqlJsStatic>;
  }
}

const SQLJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2";

const SEED_SQL = `
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  title TEXT,
  category TEXT,
  domain TEXT,
  tools TEXT,
  status TEXT,
  metric TEXT
);
INSERT INTO projects VALUES
(1,'AFM Z-Height Map Reconstruction','Deep Learning','Research','PyTorch, Attention U-Net, ResNet18','Completed','92.7% median height recovery, 0.80 nm MAE'),
(2,'S&P 500 Sector Intelligence','Business Intelligence','Finance','Tableau, Python, Bash','Completed','619K records, 11 sectors, Comm Services +138%'),
(3,'ChurnShield AI','Machine Learning','Business Analytics','XGBoost, SHAP, K-Means, Streamlit','Completed','0.8493 ROC-AUC, recall 53%->76%'),
(4,'Stock Price Prediction','Machine Learning','Finance','Random Forest, SHAP, Alpaca API','Completed','~1-2% MAE next-day close'),
(5,'Hybrid Music Recommender','Machine Learning','Recommenders','XGBoost, KNN, scikit-learn','Completed','93,185 tracks, R2 0.474'),
(6,'Zomato Rating Prediction','Machine Learning','Deployment','Extra Trees, Flask','Completed','71,730 records cleaned to 23,248'),
(7,'Sustainable Fashion Viz','Data Visualization','Sustainability','D3.js, TopoJSON','Completed','5,000 brands, 10 countries, 2010-2024'),
(8,'Declassified Docs Explorer','Data Visualization','Government','D3.js, Pandas ETL','Completed','111 documents, 5 agencies'),
(9,'Disease Risk Prediction','Machine Learning','Healthcare','XGBoost, SHAP, Streamlit','Completed','Multi-disease stacking ensembles'),
(10,'LinkedIn Auto-Post Agent','AI Agents','Automation','Claude API, GitHub Actions','Completed','Daily autonomous drafts'),
(11,'Research Paper Job-Match Agent','AI Agents','NLP','LangChain, OpenAI API','In Progress','Semantic resume-job matching'),
(12,'Financial Fraud Detection','Deep Learning','Finance','Isolation Forest, Autoencoder','In Progress','Reconstruction-based anomaly detection');

CREATE TABLE skills (
  name TEXT,
  category TEXT,
  years REAL
);
INSERT INTO skills VALUES
('Python','Language',4),('SQL','Language',4),('Tableau','BI',3),
('scikit-learn','ML',3),('XGBoost','ML',3),('PyTorch','DL',2),
('SHAP','Explainability',2),('Streamlit','Apps',3),('D3.js','Viz',2),
('Plotly','Viz',3),('Statistics','Math',4),('A/B Testing','Analytics',3);
`;

const PRESETS = [
  {
    label: "All ML projects",
    sql: "SELECT title, tools, metric FROM projects WHERE category = 'Machine Learning';",
  },
  {
    label: "Finance work",
    sql: "SELECT title, category, metric FROM projects WHERE domain = 'Finance';",
  },
  {
    label: "Projects per category",
    sql: "SELECT category, COUNT(*) AS n FROM projects GROUP BY category ORDER BY n DESC;",
  },
  {
    label: "Top skills by years",
    sql: "SELECT name, category, years FROM skills ORDER BY years DESC LIMIT 6;",
  },
];

let dbPromise: Promise<SqlJsDatabase> | null = null;

function getDatabase(): Promise<SqlJsDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    if (!window.initSqlJs) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${SQLJS_CDN}/sql-wasm.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load sql.js"));
        document.head.appendChild(script);
      });
    }
    const SQL = await window.initSqlJs!({
      locateFile: (file) => `${SQLJS_CDN}/${file}`,
    });
    const db = new SQL.Database();
    db.run(SEED_SQL);
    return db;
  })();
  return dbPromise;
}

const SqlConsole = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(PRESETS[0].sql);
  const [results, setResults] = useState<SqlJsResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const run = useCallback(async (sql: string) => {
    setLoading(true);
    setError(null);
    try {
      const db = await getDatabase();
      const res = db.exec(sql);
      setResults(res);
      if (res.length === 0) setError("Query ran, but returned no rows.");
    } catch (e) {
      setResults(null);
      setError(e instanceof Error ? e.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    // warm the wasm + run the default query on first open
    run(query);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleTextareaKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run(query);
    }
  };

  return (
    <>
      <button
        className="sql-trigger"
        onClick={() => setOpen(true)}
        data-cursor="disable"
        aria-label="Open SQL console"
      >
        <MdTerminal />
        <span>SQL</span>
      </button>

      {open &&
        createPortal(
          <div className="sql-overlay" onClick={() => setOpen(false)}>
            <div className="sql-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sql-titlebar">
                <span className="sql-dots">
                  <i /> <i /> <i />
                </span>
                <span className="sql-title">
                  anuj_portfolio.db — SQLite in your browser
                </span>
                <button
                  className="sql-close"
                  onClick={() => setOpen(false)}
                  data-cursor="disable"
                  aria-label="Close SQL console"
                >
                  <MdClose />
                </button>
              </div>

              <div className="sql-body">
                <p className="sql-hint">
                  Real SQLite (WASM) running on my actual project data. Tables:{" "}
                  <code>projects</code>(id, title, category, domain, tools,
                  status, metric) · <code>skills</code>(name, category, years).
                  ⌘/Ctrl+Enter to run.
                </p>

                <div className="sql-presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      className="sql-preset"
                      onClick={() => {
                        setQuery(p.sql);
                        run(p.sql);
                      }}
                      data-cursor="disable"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="sql-editor">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleTextareaKey}
                    rows={3}
                    spellCheck={false}
                    data-cursor="disable"
                  />
                  <button
                    className="sql-run"
                    onClick={() => run(query)}
                    disabled={loading}
                    data-cursor="disable"
                  >
                    {loading ? "…" : "Run ▸"}
                  </button>
                </div>

                {error && <p className="sql-error">{error}</p>}

                {results?.map((res, i) => (
                  <div className="sql-results" key={i}>
                    <table>
                      <thead>
                        <tr>
                          {res.columns.map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {res.values.map((row, r) => (
                          <tr key={r}>
                            {row.map((cell, c) => (
                              <td key={c}>{String(cell ?? "NULL")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="sql-rowcount">
                      {res.values.length} row{res.values.length === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SqlConsole;
