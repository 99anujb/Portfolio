import { useMemo, useState } from "react";
import "./styles/Playground.css";

// Deterministic synthetic telecom dataset (mirrors the ChurnShield project domain)
interface Customer {
  contract: "Month-to-month" | "One year" | "Two year";
  tenure: number;
  monthly: number;
  churned: boolean;
}

const CONTRACTS = ["Month-to-month", "One year", "Two year"] as const;

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateCustomers(): Customer[] {
  const rng = seededRng(42);
  const customers: Customer[] = [];
  for (let i = 0; i < 400; i++) {
    const c = rng();
    const contract: Customer["contract"] =
      c < 0.5 ? "Month-to-month" : c < 0.8 ? "One year" : "Two year";
    const tenure = Math.floor(
      contract === "Month-to-month"
        ? rng() * 40 + 1
        : contract === "One year"
          ? rng() * 55 + 6
          : rng() * 66 + 6
    );
    const monthly = Math.round((25 + rng() * 90) * 100) / 100;
    // churn probability shaped like real telecom data:
    // short tenure + month-to-month + high bill => higher churn
    const churnP =
      (contract === "Month-to-month" ? 0.42 : contract === "One year" ? 0.12 : 0.04) +
      (tenure < 12 ? 0.18 : tenure < 24 ? 0.06 : -0.04) +
      (monthly > 80 ? 0.08 : 0);
    customers.push({ contract, tenure, monthly, churned: rng() < churnP });
  }
  return customers;
}

const ALL_CUSTOMERS = generateCustomers();

const Playground = () => {
  const [contractFilter, setContractFilter] = useState<string>("All");
  const [maxTenure, setMaxTenure] = useState(72);

  const filtered = useMemo(
    () =>
      ALL_CUSTOMERS.filter(
        (c) =>
          (contractFilter === "All" || c.contract === contractFilter) &&
          c.tenure <= maxTenure
      ),
    [contractFilter, maxTenure]
  );

  const churned = filtered.filter((c) => c.churned);
  const churnRate = filtered.length ? churned.length / filtered.length : 0;
  const avgMonthly = filtered.length
    ? filtered.reduce((s, c) => s + c.monthly, 0) / filtered.length
    : 0;
  const revenueAtRisk = churned.reduce((s, c) => s + c.monthly, 0);

  // Churn rate by contract (for bar chart)
  const byContract = CONTRACTS.map((contract) => {
    const group = ALL_CUSTOMERS.filter(
      (c) => c.contract === contract && c.tenure <= maxTenure
    );
    const rate = group.length
      ? group.filter((c) => c.churned).length / group.length
      : 0;
    return { contract, rate, n: group.length };
  });

  // Tenure histogram (12-month buckets)
  const buckets = [0, 12, 24, 36, 48, 60].map((start) => {
    const group = filtered.filter(
      (c) => c.tenure >= start && c.tenure < start + 12
    );
    return {
      label: `${start}-${start + 12}`,
      total: group.length,
      churned: group.filter((c) => c.churned).length,
    };
  });
  const maxBucket = Math.max(...buckets.map((b) => b.total), 1);

  // Donut chart geometry
  const donutR = 52;
  const circumference = 2 * Math.PI * donutR;

  return (
    <div className="playground-section section-container" id="playground">
      <div className="playground-container">
        <h2>
          Analytics <span>Playground</span>
        </h2>
        <p className="playground-sub">
          Don't just read about my dashboards — use one. Filter this synthetic
          telecom dataset (modeled on my ChurnShield project) and watch every
          number recompute live.
        </p>

        <div className="playground-controls">
          <div className="playground-control">
            <label>Contract type</label>
            <div className="playground-pills">
              {["All", ...CONTRACTS].map((c) => (
                <button
                  key={c}
                  className={`playground-pill ${contractFilter === c ? "playground-pill-active" : ""}`}
                  onClick={() => setContractFilter(c)}
                  data-cursor="disable"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="playground-control">
            <label>
              Max tenure: <strong>{maxTenure} months</strong>
            </label>
            <input
              type="range"
              min={6}
              max={72}
              step={6}
              value={maxTenure}
              onChange={(e) => setMaxTenure(Number(e.target.value))}
              data-cursor="disable"
            />
          </div>
        </div>

        <div className="playground-kpis">
          <div className="playground-kpi">
            <span className="playground-kpi-value">{filtered.length}</span>
            <span className="playground-kpi-label">Customers</span>
          </div>
          <div className="playground-kpi">
            <span className="playground-kpi-value playground-danger">
              {(churnRate * 100).toFixed(1)}%
            </span>
            <span className="playground-kpi-label">Churn Rate</span>
          </div>
          <div className="playground-kpi">
            <span className="playground-kpi-value">
              ${avgMonthly.toFixed(0)}
            </span>
            <span className="playground-kpi-label">Avg Monthly Charge</span>
          </div>
          <div className="playground-kpi">
            <span className="playground-kpi-value playground-danger">
              ${revenueAtRisk.toFixed(0)}
            </span>
            <span className="playground-kpi-label">Monthly Rev. at Risk</span>
          </div>
        </div>

        <div className="playground-charts">
          <div className="playground-chart">
            <h4>Churn rate by contract</h4>
            <div className="pg-bars">
              {byContract.map((b) => (
                <div className="pg-bar-row" key={b.contract}>
                  <span className="pg-bar-label">{b.contract}</span>
                  <div className="pg-bar-track">
                    <div
                      className="pg-bar-fill"
                      style={{ width: `${Math.max(b.rate * 100, 2)}%` }}
                    />
                  </div>
                  <span className="pg-bar-value">
                    {(b.rate * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="pg-insight">
              Month-to-month contracts churn ~{Math.round(
                (byContract[0].rate / Math.max(byContract[2].rate, 0.01))
              )}
              × more than two-year contracts — the #1 retention lever.
            </p>
          </div>

          <div className="playground-chart">
            <h4>Customers by tenure (churned highlighted)</h4>
            <div className="pg-hist">
              {buckets.map((b) => (
                <div className="pg-hist-col" key={b.label}>
                  <div className="pg-hist-stack">
                    <div
                      className="pg-hist-total"
                      style={{ height: `${(b.total / maxBucket) * 100}%` }}
                    >
                      <div
                        className="pg-hist-churned"
                        style={{
                          height: b.total
                            ? `${(b.churned / b.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="pg-hist-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="playground-chart pg-donut-chart">
            <h4>Retained vs churned</h4>
            <svg viewBox="0 0 140 140" className="pg-donut">
              <circle
                cx="70"
                cy="70"
                r={donutR}
                fill="none"
                stroke="rgba(94,234,212,0.25)"
                strokeWidth="16"
              />
              <circle
                cx="70"
                cy="70"
                r={donutR}
                fill="none"
                stroke="#f472b6"
                strokeWidth="16"
                strokeDasharray={`${churnRate * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
              <text
                x="70"
                y="66"
                textAnchor="middle"
                fill="#eae5ec"
                fontSize="20"
                fontWeight="600"
              >
                {(churnRate * 100).toFixed(1)}%
              </text>
              <text
                x="70"
                y="84"
                textAnchor="middle"
                fill="rgba(234,229,236,0.5)"
                fontSize="9"
              >
                CHURN
              </text>
            </svg>
            <div className="pg-legend">
              <span>
                <i className="pg-dot pg-dot-teal" /> Retained
              </span>
              <span>
                <i className="pg-dot pg-dot-pink" /> Churned
              </span>
            </div>
          </div>
        </div>

        <p className="playground-note">
          Synthetic data, seeded for reproducibility. The real project — 7,043
          records, XGBoost at 0.8493 ROC-AUC — is in the Work section above.
        </p>
      </div>
    </div>
  );
};

export default Playground;
