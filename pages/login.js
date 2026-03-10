import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    await signIn("credentials",{
      username,
      password,
      callbackUrl:"/"
    })
  }

  return (
    <div style={styles.container}>

      <h1>Titanova Login</h1>

      <form onSubmit={handleLogin} style={styles.form}>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button}>
          Login
        </button>

      </form>

    </div>
  )
}

const styles = {
container:{
minHeight:"100vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
background:"#0f172a",
color:"white"
},

form:{
display:"flex",
flexDirection:"column",
gap:"10px"
},

input:{
padding:"10px",
borderRadius:"6px",
border:"none",
width:"200px"
},

button:{
padding:"10px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"6px",
cursor:"pointer"
}
}
