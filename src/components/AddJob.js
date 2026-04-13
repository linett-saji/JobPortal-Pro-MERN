import React, { useState } from "react";
import axios from "axios";

function AddJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !company || !salary) {
  alert("All fields are required!");
  return;
}

    await axios.post("http://localhost:5000/addJob", {
      title,
      company,
      salary
    });

    alert("Job Added");
  };

  return (
    <div>
      <h2>Add Job</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Job Title" onChange={(e) => setTitle(e.target.value)} />
        <br /><br />

        <input placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
        <br /><br />

        <input placeholder="Salary" onChange={(e) => setSalary(e.target.value)} />
        <br /><br />

        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}

export default AddJob;