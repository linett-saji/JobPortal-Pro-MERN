import React, { useEffect, useState } from "react";
import axios from "axios";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Fetch Jobs
  useEffect(() => {
    axios.get("http://localhost:5000/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔹 Delete Job
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/deleteJob/${id}`);
    window.location.reload();
  };

  // 🔹 Update Input Change
  const handleChange = (id, field, value) => {
    setJobs(prev =>
      prev.map(job =>
        job._id === id ? { ...job, [field]: value } : job
      )
    );
  };

  // 🔹 Update Job
  const handleUpdate = async (id) => {
    const job = jobs.find(j => j._id === id);

    await axios.put(`http://localhost:5000/updateJob/${id}`, job);

    alert("Updated!");
  };

  // 🔹 Apply Job
  const applyJob = async (id) => {
    const name = prompt("Enter your name");
    const email = prompt("Enter your email");

    if (!name || !email) {
      alert("Enter details properly");
      return;
    }

    await axios.post("http://localhost:5000/applyJob", {
      name,
      email,
      jobId: id
    });

    alert("Applied Successfully");
  };

  // 🔹 Resume Upload
  const uploadResume = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    await axios.post("http://localhost:5000/uploadResume", formData);

    alert("Resume Uploaded");
  };

  return (
    <div>
      <h2>Job List</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search job..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {jobs
        .filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase())
        )
        .map(job => (
          <div key={job._id} style={{ borderBottom: "1px solid gray", marginBottom: "15px" }}>

            <p>
              {job.title} - {job.company} - {job.salary}
            </p>

            <button onClick={() => handleUpdate(job._id)}>Update</button>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
            <button onClick={() => applyJob(job._id)}>Apply</button>

            <br /><br />

            {/* 📄 Resume Upload */}
            <input
              type="file"
              onChange={(e) => uploadResume(e.target.files[0])}
            />

          </div>
        ))}
    </div>
  );
}

export default JobList;