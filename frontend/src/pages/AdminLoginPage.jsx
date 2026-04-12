import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", {
        username,
        password,
      });

      localStorage.setItem("adminToken", response.data.access_token);
      navigate("/admin/results");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to login as admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>
          Sign in to access the election results dashboard.
        </p>

        <form onSubmit={handleAdminLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

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
    padding: "2.8rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "var(--shadow)",
    border: "1px solid rgba(255,255,255,0.6)",
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
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "var(--error)",
    marginTop: "1rem",
    textAlign: "center",
  },
};

export default AdminLoginPage;