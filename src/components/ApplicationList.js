import React, { useEffect, useState } from "react";
import axios from "axios";

function ApplicationList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/applications")
      .then(res => setApplications(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Applications</h2>

      {applications.map(app => (
        <div key={app._id} style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}>
          <p><b>Name:</b> {app.name}</p>
          <p><b>Email:</b> {app.email}</p>
          <p><b>Job ID:</b> {app.jobId}</p>
        </div>
      ))}
    </div>
  );
}

export default ApplicationList;