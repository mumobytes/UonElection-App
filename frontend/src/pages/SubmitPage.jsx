import { useState } from "react";
import api from "../api/api";

function SubmitPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("voterToken");
  const voterName = localStorage.getItem("voterName");

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        "/vote/submit-ballot",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setSubmitted(true);

      localStorage.removeItem("voterToken");
      localStorage.removeItem("admission_no");
      localStorage.removeItem("email");
      localStorage.removeItem("voterName");
      localStorage.removeItem("voterId");
      localStorage.removeItem("currentVoteIndex");
      localStorage.removeItem("completedVotes");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to submit ballot"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>✓</div>
          <h1 style={styles.title}>Thank You for Voting</h1>
          <p style={styles.subtitle}>
            {voterName ? `${voterName}, ` : ""}
            your vote has been successfully recorded.
          </p>
          <p style={styles.message}>
            Every vote matters, and your voice helps shape the future of NASA.
          </p>
          <p style={styles.footer}>You may now safely close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✓</div>
        <h1 style={styles.title}>Final Submission</h1>
        <p style={styles.subtitle}>
          You have reached the end of the ballot. Submit your votes to complete the process.
        </p>

        <button
          onClick={handleFinalSubmit}
          disabled={submitting}
          style={styles.button}
        >
          {submitting ? "Submitting..." : "Submit Ballot"}
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
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
    backgroundColor: "var(--surface)",
    padding: "3rem",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "var(--shadow)",
    border: "1px solid rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  icon: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#dcfce7",
    color: "var(--primary-dark)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 auto 1.2rem auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "var(--text)",
  },
  subtitle: {
    color: "var(--muted)",
    marginBottom: "1.2rem",
    lineHeight: "1.7",
  },
  message: {
    color: "var(--text)",
    fontSize: "1rem",
    lineHeight: "1.7",
    marginBottom: "1rem",
  },
  footer: {
    color: "var(--muted)",
    fontSize: "0.95rem",
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
  success: {
    color: "var(--success)",
    marginTop: "1rem",
  },
  error: {
    color: "var(--error)",
    marginTop: "1rem",
  },
};

export default SubmitPage;