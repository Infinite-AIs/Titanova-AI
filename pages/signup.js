"use client";

import { useState } from "react";
import { useRouter } from "next/router";

let users = []; // same in-memory users

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = () => {
    if (!email || !password) return alert("Enter email and password");

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      return alert("User already exists!");
    }

    users.push({ email, password });
    alert("User created! You can now login.");
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 50 }}>
      <h1>Sign Up</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 10, padding: 8 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleSignUp} style={{ padding: 10 }}>
        Sign Up
      </button>
    </div>
  );
}
