import { useState } from "react";

export default function Scanner() {
const analyzeFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setResult("Reading file...");

  const buffer = await file.arrayBuffer();

  setResult("Generating SHA256 hash...");

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  setResult("Preparing file for upload...");

  const base64 = btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );

  setResult("Checking malware database...");

  const res = await fetch("/api/hashscan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      hash,
      fileData: base64
    })
  });

  const data = await res.json();

  setResult(JSON.stringify({
    file: file.name,
    size: file.size,
    sha256: hash,
    scan: data
  }, null, 2));
};
  const [result, setResult] = useState("Upload a file to analyze.");

  const analyzeFile = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setResult("Generating file hash...");

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hash = hashArray.map(b =>
      b.toString(16).padStart(2, "0")
    ).join("");

    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(buffer))
    );

    setResult("Checking malware database...");

    const res = await fetch("/api/hashscan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hash,
        fileData: base64
      })
    });

    const data = await res.json();

    setResult(JSON.stringify({
      file: file.name,
      size: file.size,
      sha256: hash,
      scan: data
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
