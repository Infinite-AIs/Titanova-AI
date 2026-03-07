import { useState } from "react";

export default function Scanner() {

  const [status, setStatus] = useState("Upload a file to analyze.");
  const [details, setDetails] = useState("");

  const analyzeFile = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setStatus("Reading file...");

    const buffer = await file.arrayBuffer();

    setStatus("Generating SHA256 hash...");

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b =>
      b.toString(16).padStart(2, "0")
    ).join("");

    setStatus("Checking malware database...");

    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(buffer))
    );

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

    if (data.type === "known") {

      const malicious = data.stats.malicious;

      if (malicious > 0) {
        setStatus("🔴 MALWARE DETECTED");
      } else {
        setStatus("🟢 SAFE");
      }

      setDetails(`
File: ${file.name}
Size: ${file.size} bytes
SHA256: ${hash}

Malicious detections: ${malicious}
Suspicious: ${data.stats.suspicious}
Harmless engines: ${data.stats.harmless}
`);

    } else if (data.type === "uploaded") {

      setStatus("🟡 File uploaded for analysis. Results may take a minute.");

      setDetails(`
File: ${file.name}
Size: ${file.size} bytes
SHA256: ${hash}

VirusTotal is analyzing this file.
Refresh later to see detection results.
`);

    } else {

      setStatus("Unknown result");
      setDetails(JSON.stringify(data, null, 2));

    }
  };

  return (
    <div style={styles.container}>

      <a href="/services" style={styles.back}>
        ← Back to Services
      </a>

      <h1 style={styles.title}>Titanova File Analyzer</h1>

      <div style={styles.card}>

        <input type="file" onChange={analyzeFile} />

        <h2 style={styles.status}>{status}</h2>

        <pre style={styles.result}>
          {details}
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
    margin: "0 auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },

  status: {
    marginTop: "20px",
    fontSize: "24px"
  },

  result: {
    marginTop: "20px",
    backgroundColor: "#020617",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    fontSize: "13px"
  },

  back: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
    textDecoration: "none"
  }
};
