import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin");
      return;
    }

    fetchResults();
  }, [adminToken, navigate]);

  const fetchResults = async () => {
    try {
      const response = await api.get("/admin/results", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load results"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  if (loading) {
    return <div style={styles.loading}>Loading results...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Election Results Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {results.map((position) => (
          <div key={position.position_id} style={styles.card}>
            <h2 style={styles.positionTitle}>{position.name}</h2>

            <div style={styles.resultsList}>
              {position.results.map((candidate, index) => (
                <div key={candidate.candidate_id} style={styles.resultRow}>
                  <div>
                    <p style={styles.rank}>
                      {index === 0 ? " Leading" : `#${index + 1}`}
                    </p>
                    <p style={styles.candidateName}>{candidate.full_name}</p>
                  </div>
                  <div style={styles.voteBadge}>
                    {candidate.total_votes} vote{candidate.total_votes !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, var(--secondary), var(--background))",
    padding: "2rem",
  },
  header: {
    maxWidth: "1100px",
    margin: "0 auto 2rem auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "var(--text)",
  },
  logoutButton: {
    padding: "0.8rem 1.2rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "var(--primary)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "var(--surface)",
    borderRadius: "18px",
    padding: "1.5rem",
    boxShadow: "var(--shadow)",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  positionTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "var(--text)",
  },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid var(--border)",
    gap: "1rem",
  },
  rank: {
    fontSize: "0.8rem",
    color: "var(--muted)",
    marginBottom: "0.2rem",
  },
  candidateName: {
    fontWeight: "600",
    color: "var(--text)",
  },
  voteBadge: {
    backgroundColor: "#dcfce7",
    color: "var(--primary-dark)",
    padding: "0.45rem 0.8rem",
    borderRadius: "999px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "var(--text)",
    background: "linear-gradient(135deg, var(--secondary), var(--background))",
  },
  error: {
    maxWidth: "1100px",
    margin: "0 auto 1rem auto",
    color: "var(--error)",
    fontWeight: "500",
  },
};

export default ResultsPage;