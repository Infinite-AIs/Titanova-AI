"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

/* 🔹 PASTE YOUR FIREBASE CONFIG HERE */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {

  const [messages,setMessages] = useState([]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const [user,setUser] = useState(null);

  const chatRef = useRef(null);

  /* track login */
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth,(u)=>{
      setUser(u);
    });
    return ()=>unsub();
  },[]);

  /* auto scroll */
  useEffect(()=>{
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  },[messages,loading]);

async function sendMessage(){

  if(!input.trim()) return;

    const updated = [...messages,{role:"user",content:input}];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try{

      const res = await fetch("/api/nexis",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages: updated })
      });

      const data = await res.json();

      setMessages([
        ...updated,
        { role:"assistant",content:data.result }
      ]);

    }catch{

      setMessages([
        ...updated,
        { role:"assistant",content:"Titanova could not respond." }
      ]);

    }

    setLoading(false);
  }

  /* signup */
  async function signup(){

    const email = prompt("Email");
    const pass = prompt("Password");

    if(!email || !pass) return;

    try{
      await createUserWithEmailAndPassword(auth,email,pass);
      alert("Account created");
    }catch(e){
      alert(e.message);
    }
  }

  /* login */
  async function login(){

    const email = prompt("Email");
    const pass = prompt("Password");

    if(!email || !pass) return;

    try{
      await signInWithEmailAndPassword(auth,email,pass);
    }catch(e){
      alert(e.message);
    }
  }

  return(
  <>
  <Head>
  <title>Titanova AI</title>
  <link rel="icon" href="/favicon.ico"/>
  </Head>

  <div style={styles.container}>

  <img src="/logo.png" style={styles.logo}/>

  {/* top buttons */}

  <div style={styles.topButtons}>

  <a href="/services">
  <button style={styles.greenBtn}>Services</button>
  </a>

  {!user && (
  <>
  <button style={styles.greenBtn} onClick={signup}>Sign Up</button>
  <button style={styles.greenBtn} onClick={login}>Login</button>
  </>
  )}

  {user && (
  <button style={styles.greenBtn} onClick={()=>signOut(auth)}>
  Logout
  </button>
  )}

  </div>

  {/* chat */}

  <div style={styles.chatWrap}>

  <div style={styles.chat} ref={chatRef}>

  {messages.length===0 && (
  <div style={styles.welcome}>
  <h1>Titanova AI</h1>
  <p>Ask anything to begin</p>
  </div>
  )}

  {messages.map((m,i)=>(
  <div key={i}
  style={{
  ...styles.msg,
  alignSelf: m.role==="user"?"flex-end":"flex-start",
  backgroundColor: m.role==="user"?"#2563eb":"#1f2937"
  }}>
  {m.content}
  </div>
  ))}

  {loading && (
  <div style={{...styles.msg,background:"#1f2937"}}>
  Thinking...
  </div>
  )}

  </div>

  {/* input */}

  <div style={styles.inputArea}>

  <textarea
  value={input}
  onChange={e=>setInput(e.target.value)}
  style={styles.textbox}
  placeholder="Message Titanova..."
  onKeyDown={(e)=>{
  if(e.key==="Enter" && !e.shiftKey){
  e.preventDefault();
  sendMessage();
  }
  }}
  />

  <button style={styles.sendBtn} onClick={sendMessage}>
  Send
  </button>

  </div>

  </div>

  </div>
  </>
  );
}

/* styles */

const styles={

container:{
height:"100vh",
background:"#0f172a",
color:"white",
display:"flex",
justifyContent:"center"
},

logo:{
position:"fixed",
top:"20px",
left:"20px",
width:"80px",
borderRadius:"50%"
},

topButtons:{
position:"fixed",
top:"20px",
right:"20px",
display:"flex",
flexDirection:"column",
gap:"10px"
},

greenBtn:{
padding:"10px 16px",
background:"#16a34a",
border:"none",
borderRadius:"10px",
color:"white",
cursor:"pointer"
},

chatWrap:{
width:"100%",
maxWidth:"800px",
display:"flex",
flexDirection:"column",
height:"100vh"
},

chat:{
flex:1,
overflowY:"auto",
display:"flex",
flexDirection:"column",
justifyContent:"flex-end",
gap:"10px",
padding:"30px"
},

msg:{
padding:"12px 16px",
borderRadius:"18px",
maxWidth:"75%"
},

inputArea:{
display:"flex",
padding:"20px",
borderTop:"1px solid #1e293b"
},

textbox:{
flex:1,
padding:"14px",
borderRadius:"14px",
border:"none",
marginRight:"10px",
resize:"none"
},

sendBtn:{
padding:"14px 20px",
background:"#2563eb",
border:"none",
borderRadius:"14px",
color:"white",
cursor:"pointer"
},

welcome:{
textAlign:"center",
marginTop:"30%"
}

};
