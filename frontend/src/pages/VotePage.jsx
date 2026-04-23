import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function VotePage() {
  const [positions, setPositions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [completedVotes, setCompletedVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("voterToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const savedIndex = localStorage.getItem("currentVoteIndex");
    const savedCompletedVotes = localStorage.getItem("completedVotes");

    if (savedIndex) {
      setCurrentIndex(Number(savedIndex));
    }

    if (savedCompletedVotes) {
      setCompletedVotes(JSON.parse(savedCompletedVotes));
    }

    fetchPositions();
  }, [navigate, token]);

  useEffect(() => {
    localStorage.setItem("currentVoteIndex", currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem("completedVotes", JSON.stringify(completedVotes));
  }, [completedVotes]);

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get("/vote/positions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPositions(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load ballot");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before proceeding");
      return;
    }

    setError("");
    setSubmitting(true);

    const currentPosition = positions[currentIndex];

    if (completedVotes[currentPosition.position_id]) {
      setError("You have already voted for this position");
      setSubmitting(false);
      return;
    }

    try {
      await api.post(
        "/vote/cast-vote",
        {
          position_id: currentPosition.position_id,
          candidate_id: selectedCandidate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedVotes = {
        ...completedVotes,
        [currentPosition.position_id]: true,
      };

      setCompletedVotes(updatedVotes);
      setSelectedCandidate(null);

      if (currentIndex < positions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        navigate("/submit");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading ballot...</div>;
  }

  if (positions.length === 0) {
    return <div style={styles.loading}>No positions available.</div>;
  }

  const currentPosition = positions[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>{currentPosition.name}</h1>
          <p style={styles.progress}>
            Position {currentIndex + 1} of {positions.length}
          </p>
        </div>

        <div style={styles.progressBarWrap}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${((currentIndex + 1) / positions.length) * 100}%`,
            }}
          />
        </div>

        <p style={styles.subtitle}>Select one candidate to continue.</p>

        <div style={styles.candidateGrid}>
          {currentPosition.candidates.map((candidate) => (
            <div
              key={candidate.candidate_id}
              onClick={() => setSelectedCandidate(candidate.candidate_id)}
              style={{
                ...styles.candidateCard,
                border:
                  selectedCandidate === candidate.candidate_id
                    ? "2px solid var(--primary)"
                    : "1px solid var(--border)",
                backgroundColor:
                  selectedCandidate === candidate.candidate_id
                    ? "#f0fdf4"
                    : "var(--surface)",
              }}
            >
              {candidate.image_url ? (
                  <img
                    src={candidate.image_url}
                    alt={candidate.full_name}
                    style={styles.candidateImage}
                  />
                ) : (
                  <div style={styles.avatarCircle}>
                    {candidate.full_name.charAt(0)}
                  </div>
                )}
              <h3 style={styles.candidateName}>{candidate.full_name}</h3>
            </div>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleVoteSubmit}
          disabled={submitting}
          style={styles.button}
        >
          {submitting
            ? "Submitting..."
            : currentIndex === positions.length - 1
            ? "Proceed to Final Submit"
            : "Next Position"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, var(--secondary), var(--background))",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "var(--surface)",
    borderRadius: "20px",
    boxShadow: "var(--shadow)",
    padding: "2.5rem",
    border: "1px solid rgba(255, 255, 255, 0.6)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "var(--text)",
  },
  progress: {
    color: "var(--muted)",
    fontWeight: "500",
  },
  progressBarWrap: {
    width: "100%",
    height: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
    margin: "1rem 0 1.5rem 0",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--primary)",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },
  subtitle: {
    color: "var(--muted)",
    marginBottom: "2rem",
  },
  candidateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.2rem",
    marginBottom: "2rem",
  },
  candidateCard: {
    borderRadius: "16px",
    padding: "1.5rem",
    cursor: "pointer",
    textAlign: "center",
    transition: "0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  candidateImage: {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  margin: "0 auto 1rem auto",
  border: "3px solid var(--secondary)",
  },
  avatarCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "var(--secondary)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1rem auto",
    fontWeight: "700",
    fontSize: "1.5rem",
    color: "var(--text)",
  },
  candidateName: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "var(--text)",
  },
  button: {
    width: "100%",
    padding: "1rem",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "var(--error)",
    marginBottom: "1rem",
    textAlign: "center",
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
};

export default VotePage;