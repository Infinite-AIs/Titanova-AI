"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";

// ---- SUPABASE CDN ----
{/* Add this script tag in _app.js or in <Head> */}
{/* <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js"></script> */}

const SUPABASE_URL = "https://dotsfokimyrktrvlxjjr.supabase.co";      // replace with your project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdHNmb2tpbXlya3Rydmx4ampyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDgzOTQsImV4cCI6MjA4ODkyNDM5NH0.uOoICg9ahAFxfgXQ54x1vIQWoFCHOKEf97NqASPHE5U"; // replace with your anon key

// @ts-ignore
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const chatRef = useRef(null);

  // check logged-in user
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/nexis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.result }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Titanova could not respond." }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  // Sign Up
  const signUp = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (!email || !password) return;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert("Check your email to confirm your account!");
  };

  // Login
  const login = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    alert("Logged in!");
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <Head>
        <title>Titanova</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        {/* Logo */}
        <img src="/logo.png" alt="Logo" style={styles.logo} />

        {/* Top Right Buttons */}
        <div style={styles.topRightButtons}>
          <button style={styles.downloadButton}>Services</button>
          {!user && <button style={styles.downloadButton} onClick={signUp}>Sign Up</button>}
          {!user && <button style={styles.downloadButton} onClick={login}>Login</button>}
          {user && <button style={styles.downloadButton} onClick={logout}>Logout</button>}
        </div>

        {/* Chat */}
        <div style={styles.chatWrapper}>
          <div style={styles.chatContainer} ref={chatRef}>
            {messages.length === 0 && (
              <div style={styles.welcomeScreen}>
                <h1 style={styles.welcomeTitle}>Titanova AI</h1>
                <p style={styles.welcomeSubtitle}>Ask me ANYTHING to get started...</p>
              </div>
            )}

            <div style={{ flexGrow: 1 }} />

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#2563eb" : "#1f2937",
                  animation: "fadeIn 0.3s ease forwards",
                }}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.message, backgroundColor: "#1f2937" }}>
                <TypingDots />
              </div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user ? "Message Titanova..." : "Login to chat..."}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!user) return alert("Login first!");
                  sendMessage();
                }
              }}
            />
            <button style={styles.button} onClick={() => (user ? sendMessage() : alert("Login first!"))}>Send</button>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
          @keyframes blink { 0%{opacity:.2;} 20%{opacity:1;} 100%{opacity:.2;} }
          .dot { animation: blink 1.4s infinite both; font-size:22px; }
          .dot:nth-child(2){ animation-delay:.2s; } .dot:nth-child(3){ animation-delay:.4s; }
        `}</style>
      </div>
    </>
  );
}

function TypingDots() {
  return <div><span className="dot">•</span><span className="dot">•</span><span className="dot">•</span></div>;
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", backgroundColor: "#0f172a", color: "white" },
  logo: { position: "fixed", top: "20px", left: "20px", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.5)", zIndex: 1000 },
  topRightButtons: { position: "fixed", top: "20px", right: "20px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px" },
  downloadButton: { padding: "10px 16px", borderRadius: "12px", border: "none", backgroundColor: "#16a34a", color: "white", cursor: "pointer", fontSize: "14px", boxShadow: "0 0 10px rgba(0,0,0,0.4)" },
  chatWrapper: { width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", height: "100vh" },
  chatContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "30px 20px", gap: "10px" },
  message: { padding: "12px 16px", borderRadius: "18px", maxWidth: "75%", fontSize: "15px", lineHeight: "1.5", wordBreak: "break-word", whiteSpace: "pre-wrap" },
  inputContainer: { display: "flex", padding: "20px", borderTop: "1px solid #1e293b", backgroundColor: "#0f172a" },
  textarea: { flex: 1, padding: "14px", borderRadius: "14px", border: "none", outline: "none", fontSize: "15px", marginRight: "10px", resize: "none" },
  button: { padding: "14px 20px", borderRadius: "14px", border: "none", backgroundColor: "#2563eb", color: "white", cursor: "pointer" },
  welcomeScreen: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: 0.8 },
  welcomeTitle: { fontSize: "32px", marginBottom: "10px" },
  welcomeSubtitle: { fontSize: "16px", color: "#94a3b8" },
};
