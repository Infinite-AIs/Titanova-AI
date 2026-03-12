"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export const dynamic = "force-dynamic";

export default function Home() {
  const [mounted, setMounted] = useState(false); // ✅ wait for client
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    setMounted(true); // client-only rendering
  }, []);

  if (!mounted || status === "loading") {
    return null; // prevent blank screen
  }

  // Show login if not logged in
  if (!session) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "white"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Sign in to Titanova</h1>
        <button
          style={{
            padding: "14px 20px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  // Chat functions
  const sendMessage = async () => {
    if (!input.trim()) return;
    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/nexis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.result }]);
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Titanova could not respond." }]);
    }

    setLoading(false);
  };

  const handleSend = () => sendMessage();

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <>
      <Head>
        <title>Titanova</title>
      </Head>
      <div style={{ height: "100vh", backgroundColor: "#0f172a", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div ref={chatRef} style={{ flex: 1, width: "100%", maxWidth: "800px", overflowY: "auto", padding: "20px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#2563eb" : "#1f2937",
              padding: "10px 15px",
              borderRadius: "12px",
              marginBottom: "10px",
              maxWidth: "70%"
            }}>
              {msg.content}
            </div>
          ))}
          {loading && <div>Typing...</div>}
        </div>
        <div style={{ display: "flex", width: "100%", maxWidth: "800px", padding: "10px" }}>
          <textarea
            style={{ flex: 1, padding: "10px", borderRadius: "10px", marginRight: "10px" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Titanova..."
          />
          <button style={{ padding: "10px 15px", borderRadius: "10px", backgroundColor: "#2563eb", color: "white", border: "none" }} onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}
