"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// 🔹 Replace this with your Firebase web config
const firebaseConfig = {
  apiKey: "AIzaSyAnlY5nZ0jhEf0wnIgwvEqAJFbPFmrIHYI",
    authDomain: "titanovaai-73e1d.firebaseapp.com",
    projectId: "titanovaai-73e1d",
    storageBucket: "titanovaai-73e1d.firebasestorage.app",
    messagingSenderId: "827299150256",
    appId: "1:827299150256:web:6dd6e164bab10c03903e75"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const chatRef = useRef(null);

  // Track logged-in user
  useEffect(() => {
    auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  // Chat auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Send message to AI
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

  // Handle login/signup
  const handleAuth = async () => {
    if (!email || !password) return;
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setAuthMode(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Titanova AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        {/* Logo */}
        <img src="/logo.png" alt="Logo" style={styles.logo} />

        {/* Top Right Buttons */}
        {!user && (
          <div style={styles.topRightButtons}>
            <button style={styles.downloadButton} onClick={() => setAuthMode("signup")}>
              Sign Up
            </button>
            <button style={styles.downloadButton} onClick={() => setAuthMode("login")}>
              Login
            </button>
          </div>
        )}
        {user && (
          <div style={styles.topRightButtons}>
            <span>Hello, {user.email}</span>
            <button style={styles.downloadButton} onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        )}

        {/* Auth Popup */}
        {authMode && (
          <div style={styles.authPopup}>
            <h2>{authMode === "signup" ? "Sign Up" : "Login"}</h2>
            <input
              style={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button style={styles.authButton} onClick={handleAuth}>
              {authMode === "signup" ? "Sign Up" : "Login"}
            </button>
            <button style={styles.closeButton} onClick={() => setAuthMode(null)}>
              Close
            </button>
          </div>
        )}

        {/* Chat */}
        {user && (
          <div style={styles.chatWrapper}>
            <div style={styles.chatContainer} ref={chatRef}>
              {messages.length === 0 && (
                <div style={styles.welcomeScreen}>
                  <h1 style={styles.welcomeTitle}>Titanova AI</h1>
                  <p style={styles.welcomeSubtitle}>Ask me ANYTHING to get started...</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.message,
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#2563eb" : "#1f2937",
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
                placeholder="Message Titanova..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button style={styles.button} onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TypingDots() {
  return (
    <div>
      <span className="dot">•</span>
      <span className="dot">•</span>
      <span className="dot">•</span>
    </div>
  );
}

// 🔹 Styles
const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", backgroundColor: "#0f172a", color: "white" },
  logo: { position: "fixed", top: "20px", left: "20px", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.5)", zIndex: 1000 },
  topRightButtons: { position: "fixed", top: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 1000 },
  downloadButton: { padding: "10px 16px", borderRadius: "12px", border: "none", backgroundColor: "#16a34a", color: "white", cursor: "pointer", fontSize: "14px", boxShadow: "0 0 10px rgba(0,0,0,0.4)" },
  authPopup: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", backgroundColor: "#1e293b", padding: "30px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 2000 },
  inputField: { padding: "10px", borderRadius: "10px", border: "none", fontSize: "14px" },
  authButton: { padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#2563eb", color: "white", cursor: "pointer" },
  closeButton: { padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "#dc2626", color: "white", cursor: "pointer" },
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
