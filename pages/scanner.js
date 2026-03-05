import { useState } from "react";

export default function Scanner() {
  const [result, setResult] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/scan", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(JSON.stringify(data));
  };

  return (
    <div style={{ padding: "40px", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>File Scanner</h1>

      <input type="file" onChange={handleUpload} />

      <p>{result}</p>
    </div>
  );
}
