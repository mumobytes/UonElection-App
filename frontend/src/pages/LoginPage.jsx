import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function LoginPage() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/request-otp", {
        admission_no: admissionNo,
        email: email,
      });

      setMessage("OTP sent successfully. Please check your email.");

      localStorage.setItem("admission_no", admissionNo);
      localStorage.setItem("email", email);

      setTimeout(() => {
        navigate("/verify-otp");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to request OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>N'ASA Voting System</h1>
        <p>Enter your admission number and School email to receive an OTP.</p>

        <form onSubmit={handleRequestOtp} style={styles.form}>
          <input
            type="text"
            placeholder="Admission Number"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="email"
            placeholder="School Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <p style={styles.helperText}>
            Check your spam folder if your inbox is empty
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </form>

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
  },
  card: {
    backgroundColor: "var(--surface)",
    padding: "2.8rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "var(--shadow)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.2rem",
  },
  input: {
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
  },
  helperText: {
  fontSize: "0.9rem",   
  color: "#6b7280",    
  marginTop: "0.5rem",
  },
  button: {
    padding: "1rem",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  success: {
    color: "var(--success)",
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
  },
  error: {
    color: "var(--error)",
    marginTop: "1rem",
    textAlign: "center",
  },
};

export default LoginPage;