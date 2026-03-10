
import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin(e) {
    e.preventDefault()

    if (username === "admin" && password === "titanova") {
      localStorage.setItem("loggedIn", "true")
      router.push("/") // go back to home
    } else {
      alert("Invalid login")
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Titanova Login</h1>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button}>Login</button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontFamily: "sans-serif"
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    width: "220px"
  },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
}
