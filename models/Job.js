const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  salary: Number
});

module.exports = mongoose.model("Job", JobSchema);