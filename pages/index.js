"use client"; // ensure client-side rendering


<script type="module">
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.2/firebase-app.js";
  import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAnlY5nZ0jhEf0wnIgwvEqAJFbPFmrIHYI",
    authDomain: "titanovaai-73e1d.firebaseapp.com",
    projectId: "titanovaai-73e1d",
    storageBucket: "titanovaai-73e1d.firebasestorage.app",
    messagingSenderId: "827299150256",
    appId: "1:827299150256:web:6dd6e164bab10c03903e75"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  // Example: Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Logged in as:", user.email);
    } else {
      console.log("Not logged in");
    }
  });

  // Functions to sign up or log in
  window.signupUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  window.loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
</script>


// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [user, setUser] = useState(null);

  // Browser-only Supabase init
  useEffect(() => {
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setSupabaseClient(supabase);

    
    // Check for active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });
  }, []);

  // IP logger
  useEffect(() => {
    fetch("/api/log");
  }, []);

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
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.result }]);
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Titanova could not respond." }]);
    }

    setLoading(false);
  };

  const handleSend = () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }
    sendMessage();
  };

  const signUp = async () => {
    if (!supabaseClient) return;
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert("Account created! You can now log in.");
  };

  const login = async () => {
    if (!supabaseClient) return;
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    setUser(data.user);
    alert("Logged in!");
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <>
      <Head>
        <title>Titanova AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />

        {/* Top-right buttons */}
        <div style={styles.topRightButtons}>
          <a href="/services" style={styles.buttonLink}>
            <button style={styles.button}>Services</button>
          </a>
          <button style={styles.button} onClick={signUp}>Sign Up</button>
          <button style={styles.button} onClick={login}>Login</button>
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

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#2563eb" : "#1f2937"
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
                  handleSend();
                }
              }}
            />
            <button style={styles.button} onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

function TypingDots() {
  return (
    <div>
      <span style={styles.dot}>•</span>
      <span style={styles.dot}>•</span>
      <span style={styles.dot}>•</span>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", backgroundColor: "#0f172a", color: "white" },
  logo: { position: "fixed", top: "20px", left: "20px", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.5)", zIndex: 1000 },
  topRightButtons: { position: "fixed", top: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 1000 },
  button: { padding: "10px 16px", borderRadius: "12px", border: "none", backgroundColor: "#16a34a", color: "white", cursor: "pointer", fontSize: "14px", boxShadow: "0 0 10px rgba(0,0,0,0.4)" },
  buttonLink: { textDecoration: "none" },
  chatWrapper: { width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", height: "100vh" },
  chatContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "30px 20px", gap: "10px" },
  message: { padding: "12px 16px", borderRadius: "18px", maxWidth: "75%", fontSize: "15px", lineHeight: "1.5", wordBreak: "break-word", whiteSpace: "pre-wrap" },
  inputContainer: { display: "flex", padding: "20px", borderTop: "1px solid #1e293b", backgroundColor: "#0f172a" },
  textarea: { flex: 1, padding: "14px", borderRadius: "14px", border: "none", outline: "none", fontSize: "15px", marginRight: "10px", resize: "none" },
  welcomeScreen: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: 0.8 },
  welcomeTitle: { fontSize: "32px", marginBottom: "10px" },
  welcomeSubtitle: { fontSize: "16px", color: "#94a3b8" },
  dot: { animation: "blink 1.4s infinite both", fontSize: "22px" },
};
