import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Logos */}
        <div style={styles.logoContainer}>
          <img
            src="/nasa.png"
            alt="NASA Logo"
            style={styles.nasaLogo}
          />
          <img
            src="/uon_logo.png"
            alt="UON Logo"
            style={styles.uonLogo}
          />
        </div>

        <h1 style={styles.title}>
          University of Nairobi Actuarial Students' Association
        </h1>

        <p style={styles.subtitle}>
          Welcome. Take part in shaping the future of NASA leadership.
          Your voice matters.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/login")}
        >
          Enter Election Portal
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
  },

  
  card: {
    backgroundColor: "var(--surface)",
    padding: "3rem",
    borderRadius: "20px",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "var(--shadow)",
    animation: "fadeIn 0.8s ease-in-out",
  },

  
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    marginBottom: "1.5rem",
  },

  
  nasaLogo: {
    height: "120px",
    objectFit: "contain",
  },

  uonLogo: {
    height: "100px",
    objectFit: "contain",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "1rem",
    color: "#666",
    fontSize: "1rem",
    lineHeight: "1.5",
  },

  
  button: {
    marginTop: "2rem",
    padding: "1rem",
    width: "100%",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "var(--primary)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default HomePage;