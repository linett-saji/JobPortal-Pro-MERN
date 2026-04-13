import React, { useState } from "react";
import axios from "axios";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  // 🔹 REGISTER
  const handleRegister = async () => {
    await axios.post("http://localhost:5000/register", {
      name,
      email,
      password,
      role
    });

    alert("Registered Successfully");
  };

  // 🔹 LOGIN
  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password
    });

    localStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);

    alert("Login Successful");
  };

  return (
    <div>

      {/* 🔁 Toggle */}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Go to Register" : "Go to Login"}
      </button>

      <h2>{isLogin ? "Login" : "Register"}</h2>

      {/* 🔹 Register Fields */}
      {!isLogin && (
        <>
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />
        </>
      )}

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {/* 🔹 Role */}
      {!isLogin && (
        <>
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
          <br /><br />
        </>
      )}

      {/* 🔹 Buttons */}
      {isLogin ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}

    </div>
  );
}

export default Auth;