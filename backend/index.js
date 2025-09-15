 // index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========================== SAMPLE DATA ========================== //
let patients = [
  { id: 1, name: "Sarah Johnson", age: 42, condition: "Lung Cancer", status: "Critical", lastVisit: "2025-09-10" },
  { id: 2, name: "Michael Chen", age: 58, condition: "Breast Cancer", status: "Stable", lastVisit: "2025-09-11" },
  { id: 3, name: "Emma Rodriguez", age: 35, condition: "Melanoma", status: "Improving", lastVisit: "2025-09-09" },
  { id: 4, name: "James Wilson", age: 67, condition: "Prostate Cancer", status: "Monitoring", lastVisit: "2025-09-08" },
  { id: 5, name: "Olivia Brown", age: 29, condition: "Thyroid Cancer", status: "Stable", lastVisit: "2025-09-12" },
];

let appointments = [
  { id: 1, patient: "Sarah Johnson", time: "10:00 AM", type: "Follow-up", status: "Confirmed", date: "2025-09-15" },
  { id: 2, patient: "Michael Chen", time: "11:30 AM", type: "Consultation", status: "Scheduled", date: "2025-09-15" },
  { id: 3, patient: "Emma Rodriguez", time: "12:00 PM", type: "Treatment", status: "Confirmed", date: "2025-09-16" },
];

let reports = [
  { id: 1, patient: "Sarah Johnson", type: "CT Scan", doctor: "Dr. Smith", date: "2025-09-10", status: "Reviewed" },
  { id: 2, patient: "Michael Chen", type: "Mammography", doctor: "Dr. Adams", date: "2025-09-11", status: "Pending" },
];

let messages = [
  { id: 1, sender: "Dr. Adams", subject: "Lab Report Review", content: "Please check the recent CT scan reports.", date: "2025-09-14", unread: true },
  { id: 2, sender: "Nurse Emily", subject: "Patient Admission", content: "New patient admitted in Ward 3.", date: "2025-09-13", unread: false },
];

// ========================== ROUTES ========================== //

// Patients
app.get("/api/patients", (req, res) => res.json(patients));
app.post("/api/patients", (req, res) => {
  const { name, age, condition, status, lastVisit } = req.body;
  if (!name || !age || !condition) return res.status(400).json({ message: "Missing required fields" });
  const newPatient = {
    id: patients.length + 1,
    name,
    age,
    condition,
    status: status || "Monitoring",
    lastVisit: lastVisit || new Date().toISOString().split("T")[0],
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Appointments
app.get("/api/appointments", (req, res) => res.json(appointments));
app.post("/api/appointments", (req, res) => {
  const { patient, time, type, date, status } = req.body;
  if (!patient || !time || !type || !date) return res.status(400).json({ message: "Missing required fields" });
  const newAppt = {
    id: appointments.length + 1,
    patient,
    time,
    type,
    status: status || "Scheduled",
    date,
  };
  appointments.push(newAppt);
  res.status(201).json(newAppt);
});

// Reports
app.get("/api/reports", (req, res) => res.json(reports));
app.post("/api/reports", (req, res) => {
  const { patient, type, doctor, date, status } = req.body;
  if (!patient || !type || !doctor) return res.status(400).json({ message: "Missing required fields" });
  const newReport = {
    id: reports.length + 1,
    patient,
    type,
    doctor,
    date: date || new Date().toISOString().split("T")[0],
    status: status || "Pending",
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

// Messages
app.get("/api/messages", (req, res) => res.json(messages));
app.post("/api/messages", (req, res) => {
  const { sender, subject, content } = req.body;
  if (!sender || !subject || !content) return res.status(400).json({ message: "All fields required" });
  const newMsg = {
    id: messages.length + 1,
    sender,
    subject,
    content,
    date: new Date().toISOString().split("T")[0],
    unread: true,
  };
  messages.unshift(newMsg);
  res.status(201).json(newMsg);
});

// Analytics (dummy prediction tool)
app.get("/api/analytics", (req, res) => {
  res.json({
    patientGrowth: "15% increase in last month",
    appointmentTrends: "Appointments up by 10%",
    criticalCases: "3 new critical patients this week",
    predictionAccuracy: "94% reliable predictions",
  });
});

// ========================== SERVER START ========================== //
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
