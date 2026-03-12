import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Account created!");
      router.push("/login");
    } else {
      alert(data.error || "Signup failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Account</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleSignup}>
        Sign Up
      </button>

    </div>
  );
}
