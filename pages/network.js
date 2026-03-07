import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function NetworkScanner() {

  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [headers, setHeaders] = useState(null);

  const runTest = async () => {
    if (!url) return;

    const regions = ["us", "eu", "asia"];

    let newResults = [];

    for (let region of regions) {

      const start = Date.now();

      try {
        const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        const latency = Date.now() - start;

        newResults.push({
          region,
          latency,
          status: data.online ? "Online" : "Offline"
        });

      } catch {
        newResults.push({
          region,
          latency: 0,
          status: "Error"
        });
      }
    }

    setResults(newResults);
    checkHeaders(url);
  };

  const checkHeaders = async (target) => {
    try {
      const res = await fetch(`/api/ping?url=${encodeURIComponent(target)}`);
      const data = await res.json();
      setHeaders(data.headers || null);
    } catch {
      setHeaders(null);
    }
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Titanova Network Dashboard</h1>

      <input
        style={styles.input}
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button style={styles.button} onClick={runTest}>
        Run Full Scan
      </button>

      {/* Live Ping Graph */}
      <div style={{ width: "100%", height: 300, marginTop: 40 }}>
        <ResponsiveContainer>
          <LineChart data={results}>
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="latency" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region Results */}
      <div style={{ marginTop: 30 }}>
        {results.map((r, i) => (
          <p key={i}>
            {r.region.toUpperCase()} — {r.status} — {r.latency}ms
          </p>
        ))}
      </div>

      {/* Security Headers */}
      {headers && (
        <div style={styles.headers}>
          <h2>Security Headers</h2>
          <pre>{JSON.stringify(headers, null, 2)}</pre>
        </div>
      )}

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    padding: "40px",
    textAlign: "center",
    fontFamily: "sans-serif"
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px"
  },

  input: {
    padding: "12px",
    width: "300px",
    borderRadius: "8px",
    border: "none",
    marginRight: "10px"
  },

  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer"
  },

  headers: {
    marginTop: "40px",
    backgroundColor: "#1f2937",
    padding: "20px",
    borderRadius: "12px"
  }
};
