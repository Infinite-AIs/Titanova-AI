export default function Services() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Titanova Services</h1>

      <div style={styles.grid}>
    <div style={styles.card}>
  <h2 style={styles.cardTitle}>Malware Scanner</h2>

  <p style={styles.cardText}>
    Scan your computer using the ClamAV engine for detecting 
    trojans, viruses, malware & other malicious threats.
  </p>
<a href="/" style={styles.homeLink}>
  <button style={styles.homeButton}>
    ← Back to Home
  </button>
</a>
  <a
    href="https://github.com/Infinite-Ais/Titanova-AI/releases/latest/download/clamav-installer.exe.exe"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button style={styles.button}>
      Download scanner
    </button>
  </a>
</div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>File Analyzer</h2>
          <p style={styles.cardText}>
            Upload a file to analyze metadata, hashes, and possible threats.
          </p>
          <button style={styles.button}>Analyze File</button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Network Scanner</h2>
          <p style={styles.cardText}>
            Scan a network or IP for open ports and security weaknesses.
          </p>
          <button style={styles.button}>Start Scan</button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>AI Security Assistant</h2>
          <p style={styles.cardText}>
            Ask Titanova about malware, cybersecurity threats, or safe coding.
          </p>
          <button style={styles.button}>Open Assistant</button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  homeButton: {
  padding: "10px 16px",
  fontSize: "14px",
  backgroundColor: "#1e88e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
},

homeLink: {
  position: "absolute",
  top: "20px",
  left: "20px",
  textDecoration: "none"
}
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "60px 30px",
    fontFamily: "sans-serif"
  },

  title: {
    textAlign: "center",
    fontSize: "36px",
    marginBottom: "40px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto"
  },

  card: {
    backgroundColor: "#1f2937",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    transition: "transform 0.2s"
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px"
  },

  cardText: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "20px"
  },

  button: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer"
  }
};
