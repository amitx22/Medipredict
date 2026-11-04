const express = require("express");
const cors = require("cors");

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

// ========================== MIDDLEWARE ========================== //

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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

// ========================== HEALTH CHECK ========================== //

app.get("/", (req, res) => {
  res.status(200).send("MediPredict Backend is Running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediPredict API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ========================== PATIENT ROUTES ========================== //

app.get("/api/patients", (req, res) => {
  res.status(200).json(patients);
});

app.post("/api/patients", (req, res) => {
  const { name, age, condition, status, lastVisit } = req.body;

  if (!name || !age || !condition) {
    return res.status(400).json({
      success: false,
      message: "Name, age and condition are required",
    });
  }

  const newPatient = {
    id: patients.length
      ? Math.max(...patients.map((p) => p.id)) + 1
      : 1,
    name,
    age,
    condition,
    status: status || "Monitoring",
    lastVisit: lastVisit || new Date().toISOString().split("T")[0],
  };

  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// ========================== APPOINTMENT ROUTES ========================== //

app.get("/api/appointments", (req, res) => {
  res.status(200).json(appointments);
});

app.post("/api/appointments", (req, res) => {
  const { patient, time, type, date, status } = req.body;

  if (!patient || !time || !type || !date) {
    return res.status(400).json({
      success: false,
      message: "Patient, time, type and date are required",
    });
  }

  const newAppointment = {
    id: appointments.length
      ? Math.max(...appointments.map((a) => a.id)) + 1
      : 1,
    patient,
    time,
    type,
    status: status || "Scheduled",
    date,
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// ========================== REPORT ROUTES ========================== //

app.get("/api/reports", (req, res) => {
  res.status(200).json(reports);
});

app.post("/api/reports", (req, res) => {
  const { patient, type, doctor, date, status } = req.body;

  if (!patient || !type || !doctor) {
    return res.status(400).json({
      success: false,
      message: "Patient, type and doctor are required",
    });
  }

  const newReport = {
    id: reports.length
      ? Math.max(...reports.map((r) => r.id)) + 1
      : 1,
    patient,
    type,
    doctor,
    date: date || new Date().toISOString().split("T")[0],
    status: status || "Pending",
  };

  reports.push(newReport);
  res.status(201).json(newReport);
});

// ========================== MESSAGE ROUTES ========================== //

app.get("/api/messages", (req, res) => {
  res.status(200).json(messages);
});

app.post("/api/messages", (req, res) => {
  const { sender, subject, content } = req.body;

  if (!sender || !subject || !content) {
    return res.status(400).json({
      success: false,
      message: "Sender, subject and content are required",
    });
  }

  const newMessage = {
    id: messages.length
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 1,
    sender,
    subject,
    content,
    date: new Date().toISOString().split("T")[0],
    unread: true,
  };

  messages.unshift(newMessage);
  res.status(201).json(newMessage);
});

// ========================== ANALYTICS ROUTE ========================== //

app.get("/api/analytics", (req, res) => {
  res.status(200).json({
    patientGrowth: "15% increase in last month",
    appointmentTrends: "Appointments up by 10%",
    criticalCases: "3 new critical patients this week",
    predictionAccuracy: "94% reliable predictions",
  });
});

// ========================== 404 HANDLER ========================== //

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ========================== ERROR HANDLER ========================== //

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ========================== SERVER START ========================== //

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 MediPredict backend running on port ${PORT}`);
});
