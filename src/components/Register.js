import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/register", {
      name,
      email,
      password,
      role
    });

    alert("Registered Successfully");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />

      <input placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br /><br />

      <select onChange={e => setRole(e.target.value)}>
        <option value="candidate">Candidate</option>
        <option value="employer">Employer</option>
      </select>

      <br /><br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;