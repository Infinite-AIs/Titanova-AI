"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      alert("Logged in!");
      router.push("/");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 50 }}>
      <h1>Login</h1>
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
      <button onClick={handleLogin} style={{ padding: 10 }}>
        Login
      </button>
    </div>
  );
}
