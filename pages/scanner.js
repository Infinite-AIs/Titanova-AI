import { useState } from "react";

export default function Scanner() {
  const [result, setResult] = useState("No file scanned yet.");

  const analyzeFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    setResult("Scanning file hash...");

    const res = await fetch("/api/hashscan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ hash })
    });

    const data = await res.json();

    setResult(JSON.stringify({
      file: file.name,
      size: file.size,
      sha256: hash,
      scan_result: data
    }, null, 2));
  };

  return (
    <div style={styles.container}>

      <a href="/services" style={styles.back}>
        ← Back to Services
      </a>

      <h1 style={styles.title}>Titanova File Analyzer</h1>

      <div style={styles.card}>
        <input type="file" onChange={analyzeFile} />

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
    textAlign: "center"
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

  result: {
    marginTop: "20px",
    backgroundColor: "#020617",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left"
  },

  back: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
    textDecoration: "none"
  }
};
