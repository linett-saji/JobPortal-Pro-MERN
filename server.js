const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve resume files

// 1. Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/mernDB")
    .then(() => console.log("✅ MongoDB Connected: mernDB"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// 2. Data Models
const Job = mongoose.model('Job', new mongoose.Schema({
    title: String, company: String, salary: String, location: String, desc: String
}));

const Application = mongoose.model('Application', new mongoose.Schema({
    jobTitle: String, candidateEmail: String, resumePath: String, date: { type: Date, default: Date.now }
}));

// 3. Resume Upload Configuration (Multer)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- API ROUTES ---

// GET All Jobs
app.get('/api/jobs', async (req, res) => res.json(await Job.find()));

// POST Create Job
app.post('/api/jobs', async (req, res) => {
    const newJob = new Job(req.body);
    await newJob.save();
    res.json(newJob);
});

// PUT Full Update Job
app.put('/api/jobs/:id', async (req, res) => {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
});

// DELETE Job
app.delete('/api/jobs/:id', async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job Removed" });
});

// POST Apply for Job
app.post('/api/apply', upload.single('resume'), async (req, res) => {
    const newApp = new Application({
        jobTitle: req.body.jobTitle,
        candidateEmail: req.body.email,
        resumePath: req.file ? req.file.path : ""
    });
    await newApp.save();
    res.json({ message: "Applied Successfully" });
});

// GET All Applications (Admin Only)
app.get('/api/admin/apps', async (req, res) => res.json(await Application.find()));

app.listen(5000, () => console.log("🚀 Server running on http://127.0.0.1:5000"));