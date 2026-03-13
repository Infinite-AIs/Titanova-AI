"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]); // all chats for current user
  const [currentChatId, setCurrentChatId] = useState(null);
  const chatRef = useRef(null);

  // Load current user and their chats
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
      const savedChats = JSON.parse(localStorage.getItem(`chats_${user}`) || "[]");
      setChats(savedChats);
      if (savedChats.length > 0) {
        setCurrentChatId(savedChats[0].id);
        setMessages(savedChats[0].messages);
      }
    }
  }, []);

  // Save messages to current chat
  useEffect(() => {
    if (!currentUser || !currentChatId) return;
    const updatedChats = chats.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages } : chat
    );
    setChats(updatedChats);
    localStorage.setItem(`chats_${currentUser}`, JSON.stringify(updatedChats));
  }, [messages, currentChatId, chats, currentUser]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  // IP logger
  useEffect(() => {
    fetch("/api/log");
  }, []);

  // === Signup/Login ===
  const signup = (email, password) => {
    if (!email || !password) return alert("Enter email and password.");
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) return alert("Account already exists!");
    users[email] = { password };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now login.");
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[email] || users[email].password !== password) return alert("Invalid credentials!");
    localStorage.setItem("currentUser", email);
    setCurrentUser(email);
    const savedChats = JSON.parse(localStorage.getItem(`chats_${email}`) || "[]");
    setChats(savedChats);
    if (savedChats.length > 0) {
      setCurrentChatId(savedChats[0].id);
      setMessages(savedChats[0].messages);
    } else {
      createNewChat();
    }
    alert(`Logged in as ${email}`);
  };

  // === Chat functions ===
  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !currentChatId) return;

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

  const createNewChat = () => {
    if (!currentUser) return;
    const newChat = { id: Date.now(), messages: [] };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChatId(newChat.id);
    setMessages([]);
    localStorage.setItem(`chats_${currentUser}`, JSON.stringify(updatedChats));
  };

  const switchChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    setCurrentChatId(id);
    setMessages(chat.messages);
  };

  return (
    <>
      <Head>
        <title>Titanova</title>
        <meta name="description" content="Ask Titanova AI anything." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />

        {/* Top Right Buttons */}
        <div style={styles.topRightButtons}>
          <a href="/services" style={styles.downloadLink}>
            <button type="button" style={styles.downloadButton}>Services</button>
          </a>
          <button style={styles.downloadButton} onClick={() => {
            const email = prompt("Enter email for signup:");
            const password = prompt("Enter password:");
            signup(email, password);
          }}>Sign Up</button>
          <button style={styles.downloadButton} onClick={() => {
            const email = prompt("Enter email to login:");
            const password = prompt("Enter password:");
            login(email, password);
          }}>Login</button>
          <button style={styles.downloadButton} onClick={createNewChat}>+ New Chat</button>
        </div>

        {/* Chat Selector */}
        {chats.length > 0 && (
          <div style={styles.chatSelector}>
            {chats.map((chat) => (
              <button
                key={chat.id}
                style={{
                  ...styles.chatButton,
                  backgroundColor: chat.id === currentChatId ? "#2563eb" : "#1f2937",
                }}
                onClick={() => switchChat(chat.id)}
              >
                Chat {chat.id}
              </button>
            ))}
          </div>
        )}

        {/* Chat */}
        <div style={{ ...styles.chatWrapper, position: "relative" }}>
          {messages.length === 0 && (
            <div style={styles.welcomeScreen}>
              <h1 style={styles.welcomeTitle}>Titanova AI</h1>
              <p style={styles.welcomeSubtitle}>Ask me ANYTHING to get started...</p>
            </div>
          )}

          <div style={styles.chatContainer} ref={chatRef}>
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
            <button style={styles.button} onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
        .dot { animation: blink 1.4s infinite both; font-size: 22px; }
        .dot:nth-child(2) { animation-delay: .2s; }
        .dot:nth-child(3) { animation-delay: .4s; }
      `}</style>
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

// === STYLES ===
const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", backgroundColor: "#0f172a", color: "white" },
  logo: { position: "fixed", top: "20px", left: "20px", width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.5)", zIndex: 1000 },
  topRightButtons: { position: "fixed", top: "20px", right: "20px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px" },
  downloadLink: { textDecoration: "none" },
  downloadButton: { padding: "10px 16px", borderRadius: "12px", border: "none", backgroundColor: "#16a34a", color: "white", cursor: "pointer", fontSize: "14px", boxShadow: "0 0 10px rgba(0,0,0,0.4)" },
  chatWrapper: {
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  paddingTop: "160px",
},
  chatContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column-reverse", padding: "30px 20px", gap: "10px" },
  message: { padding: "12px 16px", borderRadius: "18px", maxWidth: "75%", fontSize: "15px", lineHeight: "1.5", wordBreak: "break-word", whiteSpace: "pre-wrap" },
  inputContainer: { display: "flex", padding: "20px", borderTop: "1px solid #1e293b", backgroundColor: "#0f172a" },
  textarea: { flex: 1, padding: "14px", borderRadius: "14px", border: "none", outline: "none", fontSize: "15px", marginRight: "10px", resize: "none" },
  button: { padding: "14px 20px", borderRadius: "14px", border: "none", backgroundColor: "#2563eb", color: "white", cursor: "pointer" },
  welcomeScreen: { position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", opacity: 0.8 },
  welcomeTitle: { fontSize: "32px", marginBottom: "10px" },
  welcomeSubtitle: { fontSize: "16px", color: "#94a3b8" },
  chatSelector: { position: "fixed", top: "120px", right: "20px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 1000 },
  chatButton: { padding: "6px 12px", borderRadius: "10px", border: "none", cursor: "pointer", color: "white" },
};
