import { useState } from "react";

export default function Scanner() {
  const [result, setResult] = useState("");

  const analyzeFile = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    setResult(`
File Name: ${file.name}
File Size: ${file.size} bytes
SHA256 Hash: ${hashHex}
`);
  };

  return (
    <div style={styles.container}>

      <a href="/services" style={styles.backLink}>
        ← Back to Services
      </a>

      <h1 style={styles.title}>Titanova File Analyzer</h1>

      <div style={styles.card}>

        <input
          type="file"
          onChange={analyzeFile}
          style={styles.input}
        />

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
    fontFamily: "sans-serif",
    textAlign: "center"
  },

  title: {
    fontSize: "36px",
    marginBottom: "40px"
  },

  card: {
    backgroundColor: "#1f2937",
    padding: "30px",
    borderRadius: "16px",
    maxWidth: "600px",
    margin: "0 auto"
  },

  input: {
    marginBottom: "20px"
  },

  result: {
    backgroundColor: "#020617",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left",
    whiteSpace: "pre-wrap"
  },

  backLink: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
    textDecoration: "none"
  }
};
