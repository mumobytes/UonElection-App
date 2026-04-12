import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedAdmissionNo = localStorage.getItem("admission_no");

    if (!savedAdmissionNo) {
      navigate("/");
      return;
    }

    setAdmissionNo(savedAdmissionNo);
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/verify-otp", {
        admission_no: admissionNo,
        otp: otp,
      });

      localStorage.setItem("voterToken", response.data.access_token);
      localStorage.setItem("voterName", response.data.full_name);
      localStorage.setItem("voterId", response.data.voter_id);

      setMessage("OTP verified successfully");
      navigate("/vote");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to verify OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>OTP Verification</h1>
        <p style={styles.subtitle}>
          Enter the OTP sent to your email address.
        </p>

        <form onSubmit={handleVerifyOtp} style={styles.form}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Verify OTP
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
    border: "1px solid rgba(255,255,255,0.6)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "0.8rem",
  },
  subtitle: {
    color: "var(--muted)",
    textAlign: "center",
    marginBottom: "1.4rem",
    lineHeight: "1.6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "1rem",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
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
  },
  error: {
    color: "var(--error)",
    marginTop: "1rem",
    textAlign: "center",
  },
};

export default OtpPage;