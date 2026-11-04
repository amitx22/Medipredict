import React, { useEffect, useState, useCallback } from "react";
import "./medipredictdashboard.css";

const API_URL = "https://medipredict-4bkd.onrender.com/api";

const MediPredictDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientData, setPatientData] = useState([]);
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
    recipient: "",
    subject: "",
    content: "",
  });

  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

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
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(
        result.message || `Request failed: ${response.status}`
      );
    }

    return response.json();
  };

  // ================= FETCH DATA ================= //

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        patientsRes,
        appointmentsRes,
        reportsRes,
        messagesRes,
        analyticsRes,
      ] = await Promise.all([
        apiRequest("/patients"),
        apiRequest("/appointments"),
        apiRequest("/reports"),
        apiRequest("/messages"),
        apiRequest("/analytics"),
      ]);

      setPatientData(patientsRes);
      setAppointments(appointmentsRes);
      setReports(reportsRes);
      setMessages(messagesRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

      setPatientData((prev) => [...prev, patient]);

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

      alert("Appointment booked successfully!");
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
        recipient: "",
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

  // ================= REPLY ================= //

  const handleSendReply = (id) => {
    if (!replyContent.trim()) {
      alert("Reply cannot be empty");
      return;
    }

    alert(
      `Reply drafted for message ID ${id}. Reply API is not configured yet.`
    );

    setReplyContent("");
    setReplyOpenId(null);
  };

  // ================= DATE CALCULATIONS ================= //

  const today = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter(
    (apt) => apt.date === today
  );

  const pendingCount = todaysAppointments.filter(
    (apt) => apt.status?.toLowerCase() === "pending"
  ).length;

  const criticalPatients = patientData.filter(
    (patient) => patient.status === "Critical"
  );

  // ================= LOADING ================= //

  if (loading) {
    return (
      <div className="doctor-dashboard">
        <div className="main-panel">
          <h2>Loading MediPredict Dashboard...</h2>
          <p>Connecting to live backend...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR ================= //

  if (error) {
    return (
      <div className="doctor-dashboard">
        <div className="main-panel">
          <h2>Backend Connection Failed</h2>
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
                <span className="stat-number">
                  {patientData.length}
                </span>
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
                <span className="stat-number">94%</span>
                <span className="stat-trend up">Demo Metric</span>
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
                      <div
                        className={`apt-status ${
                          apt.status.toLowerCase()
                        }`}
                      >
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
                    <li
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                    >
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

            {selectedPatient && (
              <div className="card">
                <h2>Patient Details</h2>
                <p>Name: {selectedPatient.name}</p>
                <p>Age: {selectedPatient.age}</p>
                <p>Condition: {selectedPatient.condition}</p>
                <p>Status: {selectedPatient.status}</p>
                <button onClick={() => setSelectedPatient(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
        );

      // ================= PATIENTS ================= //

      case "patients":
        return (
          <div className="tab-content">
            <h2>Patient Records</h2>

            <form
              onSubmit={handleAddPatient}
              className="compose-panel"
            >
              <h3>Add New Patient</h3>

              <input
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    name: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                min="1"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    age: e.target.value,
                  })
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
                  setNewPatient({
                    ...newPatient,
                    status: e.target.value,
                  })
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

              {patientData.map((patient) => (
                <div key={patient.id} className="table-row">
                  <span>{patient.name}</span>
                  <span>{patient.age}</span>
                  <span>{patient.condition}</span>
                  <span
                    className={`status ${patient.status.toLowerCase()}`}
                  >
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

            <form
              onSubmit={handleAddAppointment}
              className="compose-panel"
            >
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
                  <span
                    className={`status ${apt.status.toLowerCase()}`}
                  >
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

            <form
              onSubmit={handleAddReport}
              className="compose-panel"
            >
              <h3>Add New Report</h3>

              <input
                placeholder="Patient Name"
                value={newReport.patient}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    patient: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Report Type"
                value={newReport.type}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    type: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Doctor Name"
                value={newReport.doctor}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    doctor: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport({
                    ...newReport,
                    date: e.target.value,
                  })
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
                  <span
                    className={`status ${report.status.toLowerCase()}`}
                     >
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
              <form
                onSubmit={handleSendMessage}
                className="compose-panel"
              >
                <input
                  placeholder="Recipient"
                  value={newMessage.recipient}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      recipient: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Subject"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      subject: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Message content..."
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      content: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit" disabled={saving}>
                  {saving ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

            <div className="messages-grid">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-card ${
                    msg.unread ? "unread" : ""
                  }`}
                >
                  <div className="msg-header">
                    <span className="msg-sender">{msg.sender}</span>
                    <span className="msg-date">{msg.date}</span>
                  </div>

                  <div className="msg-subject">{msg.subject}</div>
                  <div className="msg-content">{msg.content}</div>

                  <div className="msg-actions">
                    <button
                      onClick={() =>
                        setReplyOpenId(
                          replyOpenId === msg.id ? null : msg.id
                        )
                      }
                    >
                      Reply
                    </button>
                  </div>

                  {replyOpenId === msg.id && (
                    <div className="reply-panel">
                      <textarea
                        placeholder="Type your reply..."
                        value={replyContent}
                        onChange={(e) =>
                          setReplyContent(e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleSendReply(msg.id)}
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {messages.length === 0 && <p>No messages available.</p>}
            </div>
          </div>
        );

      default:
        return (
          <div className="tab-content">
            <p>Tab content not available.</p>
          </div>
        );
    }
  };

  // ================= MAIN LAYOUT ================= //

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>MediPredict</h1>
          <span>Oncology Dashboard</span>
        </div>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search patients, records..."
            />
          </div>

          <div className="notifications">
            <span>🔔</span>
          </div>

          <div className="doctor-profile">
            <div className="avatar">DS</div>
            <span>Dr. Smith</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            {[
              ["dashboard", "📊", "Dashboard"],
              ["patients", "👨‍👩‍👧‍👦", "Patients"],
              ["appointments", "📅", "Appointments"],
              ["reports", "📋", "Reports"],
              ["analytics", "📈", "Analytics"],
              ["messages", "✉️", "Messages"],
            ].map(([tab, icon, label]) => (
              <li
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                <span className="icon">{icon}</span> {label}
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "15px",
            }}
          >
            <button onClick={fetchDashboardData}>
              ↻ Refresh Data
            </button>
          </div>

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default MediPredictDashboard;
