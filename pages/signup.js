import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" },
  form: { display: "flex", flexDirection: "column", width: "300px", gap: "10px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  button: { padding: "10px", borderRadius: "8px", backgroundColor: "#2563eb", color: "white", border: "none", cursor: "pointer" },
};
