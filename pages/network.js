import { useState } from "react";

export default function NetworkScanner() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState("");

  const testConnection = async () => {
    if (!target) return;

    setResult("Testing connection...");

    const start = Date.now();

    try {
      const response = await fetch("/api/ping?url=" + encodeURIComponent(target));

      const data = await response.json();

      const latency = Date.now() - start;

      if (data.online) {
        setResult(`🟢 ONLINE
Latency: ${latency} ms`);
      } else {
        setResult("🔴 OFFLINE or Unreachable");
      }

    } catch (error) {
      setResult("🔴 Connection Failed");
    }
  };

  return (
    <div style={styles.container}>

      <a href="/services" style={styles.back}>
        ← Back to Services
      </a>

      <h1 style={styles.title}>Titanova Network Diagnostics</h1>

      <div style={styles.card}>

        <input
          type="text"
          placeholder="Enter website URL (https://example.com)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={styles.input}
        />

        <button onClick={testConnection} style={styles.button}>
          Test Connection
        </button>

        <pre style={styles.result}>
          {result}
        </pre>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "60px",
    textAlign: "center",
    fontFamily: "sans-serif"
  },

  title: {
    fontSize: "36px",
    marginBottom: "30px"
  },

  card: {
    backgroundColor: "#1f2937",
    padding: "30px",
    borderRadius: "16px",
    maxWidth: "600px",
    margin: "0 auto"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none"
  },

  button: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer"
  },

  result: {
    marginTop: "20px",
    backgroundColor: "#020617",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left",
    whiteSpace: "pre-wrap"
  },

  back: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
    textDecoration: "none"
  }
};
