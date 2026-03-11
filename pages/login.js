import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("loggedIn", "true");
      router.push("/");
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>

      {message && <p>{message}</p>}

      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>
          Sign up here
        </a>
      </p>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" },
  form: { display: "flex", flexDirection: "column", width: "300px", gap: "10px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  button: { padding: "10px", borderRadius: "8px", backgroundColor: "#2563eb", color: "white", border: "none", cursor: "pointer" },
};
