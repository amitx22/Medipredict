import React, { useEffect, useState } from "react";
import "./medipredictdashboard.css";

const API_BASE_URL =
  "https://medipredict-4bkd.onrender.com/api";

const MediPredictDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    sender: "Dr. Smith",
    subject: "",
    content: "",
  });

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    condition: "",
    status: "Monitoring",
  });

  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    time: "",
    type: "Consultation",
    date: "",
  });

  const [newReport, setNewReport] = useState({
    patient: "",
    type: "",
    doctor: "Dr. Smith",
    date: "",
  });

  // ================= API HELPER ================= //

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return response.json();
  };

  // ================= FETCH ALL DATA ================= //

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        patientData,
        appointmentData,
        reportData,
        messageData,
        analyticsData,
      ] = await Promise.all([
        apiRequest("/patients"),
        apiRequest("/appointments"),
        apiRequest("/reports"),
        apiRequest("/messages"),
        apiRequest("/analytics"),
      ]);

      setPatients(patientData);
      setAppointments(appointmentData);
      setReports(reportData);
      setMessages(messageData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= ADD PATIENT ================= //

  const handleAddPatient = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const patient = await apiRequest("/patients", {
        method: "POST",
        body: JSON.stringify({
          ...newPatient,
          age: Number(newPatient.age),
        }),
      });

      setPatients((prev) => [...prev, patient]);

      setNewPatient({
        name: "",
        age: "",
        condition: "",
        status: "Monitoring",
      });

      alert("Patient added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= ADD APPOINTMENT ================= //

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const appointment = await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify(newAppointment),
      });

      setAppointments((prev) => [...prev, appointment]);

      setNewAppointment({
        patient: "",
        time: "",
        type: "Consultation",
        date: "",
      });

      alert("Appointment added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= ADD REPORT ================= //

  const handleAddReport = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const report = await apiRequest("/reports", {
        method: "POST",
        body: JSON.stringify(newReport),
      });

      setReports((prev) => [...prev, report]);

      setNewReport({
        patient: "",
        type: "",
        doctor: "Dr. Smith",
        date: "",
      });

      alert("Report added successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= SEND MESSAGE ================= //

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const message = await apiRequest("/messages", {
        method: "POST",
        body: JSON.stringify(newMessage),
      });

      setMessages((prev) => [message, ...prev]);

      setNewMessage({
        sender: "Dr. Smith",
        subject: "",
        content: "",
      });

      setShowCompose(false);
      alert("Message sent successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= DASHBOARD CALCULATIONS ================= //

  const today = new Date().toLocaleDateString("en-CA");

  const todaysAppointments = appointments.filter(
    (apt) => apt.date === today
  );

  const pendingCount = todaysAppointments.filter(
    (apt) => apt.status?.toLowerCase() === "pending"
  ).length;

  const criticalPatients = patients.filter(
    (patient) => patient.status === "Critical"
  );

  // ================= LOADING / ERROR ================= //

  if (loading) {
    return (
      <div className="doctor-dashboard">
        <div className="main-panel">
          <h2>Loading MediPredict Dashboard...</h2>
          <p>Connecting to live backend.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-dashboard">
        <div className="main-panel">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ================= TAB CONTENT ================= //

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-overview">

            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <span className="stat-number">{patients.length}</span>
                <span className="stat-trend up">Live Data</span>
              </div>

              <div className="stat-card">
                <h3>Appointments Today</h3>
                <span className="stat-number">
                  {todaysAppointments.length}
                </span>
                <span className="stat-trend">
                  {pendingCount} pending
                </span>
              </div>

              <div className="stat-card">
                <h3>Critical Cases</h3>
                <span className="stat-number">
                  {criticalPatients.length}
                </span>
                <span className="stat-trend down">
                  Requires Attention
                </span>
              </div>

              <div className="stat-card">
                <h3>Prediction Accuracy</h3>
                <span className="stat-number">
                  94%
                </span>
                <span className="stat-trend up">
                  Demo Metric
                </span>
              </div>
            </div>

            <div className="main-cards">
              <div className="card upcoming-appointments">
                <h2>Today's Appointments</h2>
                <ul>
                  {todaysAppointments.map((apt) => (
                    <li key={apt.id}>
                      <div className="apt-time">{apt.time}</div>
                      <div className="apt-info">
                        <div className="apt-patient">
                          {apt.patient}
                        </div>
                        <div className="apt-type">{apt.type}</div>
                      </div>
                      <div className={`apt-status ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </div>
                    </li>
                  ))}

                  {todaysAppointments.length === 0 && (
                    <li>No appointments scheduled today.</li>
                  )}
                </ul>
              </div>

              <div className="card critical-patients">
                <h2>Patients Needing Attention</h2>
                <ul>
                  {criticalPatients.map((patient) => (
                    <li key={patient.id}>
                      <div className="patient-avatar">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="patient-info">
                        <h4>{patient.name}</h4>
                        <p>
                          {patient.condition} • {patient.age}y
                        </p>
                      </div>
                      <div className="patient-status critical">
                        Critical
                      </div>
                    </li>
                  ))}

                  {criticalPatients.length === 0 && (
                    <li>No critical patients.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="prediction-tools">
              <h2>Prediction Tools</h2>
              <div className="tools-grid">
                <div className="tool-card">
                  <div className="tool-icon">🫁</div>
                  <h3>Lung Cancer Predictor</h3>
                  <p>Upload CT scans for analysis.</p>
                  <button disabled>Run Analysis</button>
                </div>

                <div className="tool-card">
                  <div className="tool-icon">👩</div>
                  <h3>Breast Cancer Predictor</h3>
                  <p>Mammography analysis.</p>
                  <button disabled>Run Analysis</button>
                </div>

                <div className="tool-card">
                  <div className="tool-icon">🧬</div>
                  <h3>Genetic Risk Assessment</h3>
                  <p>Evaluate hereditary cancer risks.</p>
                  <button disabled>Run Analysis</button>
                </div>
              </div>
            </div>

          </div>
        );

      // ================= PATIENTS ================= //

      case "patients":
        return (
          <div className="tab-content">
            <h2>Patient Records</h2>

            <form onSubmit={handleAddPatient} className="compose-panel">
              <h3>Add New Patient</h3>

              <input
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                min="1"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, age: e.target.value })
                }
                required
              />

              <input
                placeholder="Condition"
                value={newPatient.condition}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    condition: e.target.value,
                  })
                }
                required
              />

              <select
                value={newPatient.status}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, status: e.target.value })
                }
              >
                <option>Monitoring</option>
                <option>Critical</option>
                <option>Stable</option>
                <option>Improving</option>
              </select>

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add Patient"}
              </button>
            </form>

            <div className="patients-table">
              <div className="table-header">
                <span>Name</span>
                <span>Age</span>
                <span>Condition</span>
                <span>Status</span>
                <span>Last Visit</span>
              </div>

              {patients.map((patient) => (
                <div key={patient.id} className="table-row">
                  <span>{patient.name}</span>
                  <span>{patient.age}</span>
                  <span>{patient.condition}</span>
                  <span className={`status ${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </span>
                  <span>{patient.lastVisit}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // ================= APPOINTMENTS ================= //

      case "appointments":
        return (
          <div className="tab-content">
            <h2>Appointment Schedule</h2>

            <form onSubmit={handleAddAppointment} className="compose-panel">
              <h3>Book Appointment</h3>

              <input
                placeholder="Patient Name"
                value={newAppointment.patient}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    patient: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    date: e.target.value,
                  })
                }
                required
              />

              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    time: e.target.value,
                  })
                }
                required
              />

              <select
                value={newAppointment.type}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    type: e.target.value,
                  })
                }
              >
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Treatment</option>
              </select>

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Book Appointment"}
              </button>
            </form>

            <div className="patients-table">
              <div className="table-header">
                <span>Patient</span>
                <span>Date</span>
                <span>Time</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              {appointments.map((apt) => (
                <div key={apt.id} className="table-row">
                  <span>{apt.patient}</span>
                  <span>{apt.date}</span>
                  <span>{apt.time}</span>
                  <span>{apt.type}</span>
                  <span className={`status ${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // ================= REPORTS ================= //

      case "reports":
        return (
          <div className="tab-content">
            <h2>Patient Reports</h2>

            <form onSubmit={handleAddReport} className="compose-panel">
              <h3>Add New Report</h3>

              <input
                placeholder="Patient Name"
                value={newReport.patient}
                onChange={(e) =>
                  setNewReport({ ...newReport, patient: e.target.value })
                }
                required
              />

              <input
                placeholder="Report Type"
                value={newReport.type}
                onChange={(e) =>
                  setNewReport({ ...newReport, type: e.target.value })
                }
                required
              />

              <input
                placeholder="Doctor Name"
                value={newReport.doctor}
                onChange={(e) =>
                  setNewReport({ ...newReport, doctor: e.target.value })
                }
                required
              />

              <input
                type="date"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport({ ...newReport, date: e.target.value })
                }
              />

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add Report"}
              </button>
            </form>

            <div className="patients-table">
              <div className="table-header">
                <span>Patient</span>
                <span>Report Type</span>
                <span>Doctor</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              {reports.map((report) => (
                <div key={report.id} className="table-row">
                  <span>{report.patient}</span>
                  <span>{report.type}</span>
                  <span>{report.doctor}</span>
                  <span>{report.date}</span>
                  <span className={`status ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // ================= ANALYTICS ================= //

      case "analytics":
        return (
          <div className="tab-content">
            <h2>Analytics Overview</h2>

            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Patient Growth</h3>
                <p>{analytics.patientGrowth || "No data available"}</p>
              </div>

              <div className="analytics-card">
                <h3>Appointment Trends</h3>
                <p>{analytics.appointmentTrends || "No data available"}</p>
              </div>

              <div className="analytics-card">
                <h3>Critical Cases</h3>
                <p>{analytics.criticalCases || "No data available"}</p>
              </div>

              <div className="analytics-card">
                <h3>Prediction Accuracy</h3>
                <p>{analytics.predictionAccuracy || "No data available"}</p>
              </div>
            </div>
          </div>
        );

      // ================= MESSAGES ================= //

      case "messages":
        return (
          <div className="tab-content">
            <h2>Messages</h2>

            <button
              className="compose-btn"
              onClick={() => setShowCompose(!showCompose)}
            >
              {showCompose ? "Close Compose" : "New Message"}
            </button>

            {showCompose && (
              <form onSubmit={handleSendMessage} className="compose-panel">
                <input
                  placeholder="Subject"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      subject: e.target.value,
                    })
                  }
