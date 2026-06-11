import { useEffect, useState } from "react";
import { MdStar, MdCallSplit } from "react-icons/md";
import "./styles/GitHubStats.css";

const USERNAME = "99anujb";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubData {
  repos: Repo[];
  totalStars: number;
  languages: { name: string; count: number }[];
  contributions: ContributionDay[];
  totalContributions: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3776ab",
  "Jupyter Notebook": "#f97316",
  JavaScript: "#f7df1e",
  TypeScript: "#38bdf8",
  HTML: "#e34c26",
  CSS: "#a78bfa",
};

async function fetchGitHubData(): Promise<GitHubData> {
  const cached = sessionStorage.getItem("gh-stats-v1");
  if (cached) return JSON.parse(cached);

  const repoRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`
  );
  if (!repoRes.ok) throw new Error("GitHub API error");
  const allRepos: Repo[] = await repoRes.json();
  const repos = allRepos.filter((r) => !r.fork && r.name !== USERNAME);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  const langCounts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  }
  const languages = Object.entries(langCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let contributions: ContributionDay[] = [];
  let totalContributions = 0;
  try {
    const contribRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
    );
    if (contribRes.ok) {
      const data = await contribRes.json();
      contributions = data.contributions ?? [];
      totalContributions = contributions.reduce(
        (s: number, d: ContributionDay) => s + d.count,
        0
      );
    }
  } catch {
    // calendar is optional — fail soft
  }

  const result: GitHubData = {
    repos: repos.slice(0, 6),
    totalStars,
    languages,
    contributions,
    totalContributions,
  };
  sessionStorage.setItem("gh-stats-v1", JSON.stringify(result));
  return result;
}

const LEVEL_COLORS = [
  "rgba(255,255,255,0.06)",
  "rgba(94,234,212,0.25)",
  "rgba(94,234,212,0.45)",
  "rgba(94,234,212,0.7)",
  "#5eead4",
];

const GitHubStats = () => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchGitHubData()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  return (
    <div className="github-section section-container" id="github">
      <div className="github-container">
        <h2>
          Live from <span>GitHub</span>
        </h2>
        <p className="github-sub">
          This section pulls real data from the GitHub API every visit — no
          screenshots, no staleness.
        </p>

        {!data ? (
          <p className="github-loading">Querying api.github.com…</p>
        ) : (
          <>
            <div className="github-kpis">
              <div className="github-kpi">
                <span className="github-kpi-value">{data.repos.length}+</span>
                <span className="github-kpi-label">Public Repos</span>
              </div>
              <div className="github-kpi">
                <span className="github-kpi-value">{data.totalStars}</span>
                <span className="github-kpi-label">Stars Earned</span>
              </div>
              {data.totalContributions > 0 && (
                <div className="github-kpi">
                  <span className="github-kpi-value">
                    {data.totalContributions}
                  </span>
                  <span className="github-kpi-label">
                    Contributions (1 yr)
                  </span>
                </div>
              )}
              <div className="github-kpi">
                <span className="github-kpi-value">
                  {data.languages[0]?.name ?? "—"}
                </span>
                <span className="github-kpi-label">Top Language</span>
              </div>
            </div>

            {data.contributions.length > 0 && (
              <div className="github-calendar" aria-hidden="true">
                {data.contributions.slice(-364).map((day) => (
                  <span
                    key={day.date}
                    className="github-cell"
                    title={`${day.date}: ${day.count}`}
                    style={{
                      background: LEVEL_COLORS[Math.min(day.level, 4)],
                    }}
                  />
                ))}
              </div>
            )}

            <div className="github-repos">
              {data.repos.map((repo) => (
                <a
                  key={repo.name}
                  className="github-repo"
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                >
                  <span className="github-repo-name">{repo.name}</span>
                  <span className="github-repo-desc">
                    {repo.description ?? ""}
                  </span>
                  <span className="github-repo-meta">
                    {repo.language && (
                      <span className="github-repo-lang">
                        <span
                          className="github-lang-dot"
                          style={{
                            background:
                              LANGUAGE_COLORS[repo.language] ?? "#5eead4",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="github-repo-stat">
                      <MdStar /> {repo.stargazers_count}
                    </span>
                    <span className="github-repo-stat">
                      <MdCallSplit /> {repo.forks_count}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubStats;
