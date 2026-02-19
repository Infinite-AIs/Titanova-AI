import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  // Check for admin login
  useEffect(() => {
    const session = localStorage.getItem("session");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!session || !isAdmin) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    // Get all accounts
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setAccounts([storedUser]); // currently only one user in localStorage
    }

    // Active users (just checking if session exists)
    if (localStorage.getItem("session")) {
      setActiveUsers([storedUser?.email || "Unknown"]);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <div style={styles.section}>
        <h2>Registered Accounts</h2>
        {accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <ul>
            {accounts.map((acc, i) => (
              <li key={i}>
                {acc.email} | Password: {acc.password}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.section}>
        <h2>Active Users</h2>
        {activeUsers.length === 0 ? (
          <p>No active users.</p>
        ) : (
          <ul>
            {activeUsers.map((user, i) => (
              <li key={i}>{user}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
  },
  section: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#1f2937",
    borderRadius: "12px",
  },
};
