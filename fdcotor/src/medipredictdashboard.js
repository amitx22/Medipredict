 import React, { useState } from "react";
import "./medipredictdashboard.css";

const MediPredictDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample patient data
  const patientData = [
    { id: 1, name: "Sarah Johnson", age: 42, condition: "Lung Cancer", status: "Critical", lastVisit: "2025-09-10" },
    { id: 2, name: "Michael Chen", age: 58, condition: "Breast Cancer", status: "Stable", lastVisit: "2025-09-11" },
    { id: 3, name: "Emma Rodriguez", age: 35, condition: "Melanoma", status: "Improving", lastVisit: "2025-09-09" },
    { id: 4, name: "James Wilson", age: 67, condition: "Prostate Cancer", status: "Monitoring", lastVisit: "2025-09-08" },
    { id: 5, name: "Olivia Brown", age: 29, condition: "Thyroid Cancer", status: "Stable", lastVisit: "2025-09-12" },
  ];

  // Sample appointments data
  const appointments = [
    { id: 1, patient: "Sarah Johnson", time: "10:00 AM", type: "Follow-up", status: "Confirmed", date: "2025-09-15" },
    { id: 2, patient: "Michael Chen", time: "11:30 AM", type: "Consultation", status: "Scheduled", date: "2025-09-15" },
    { id: 3, patient: "Emma Rodriguez", time: "12:00 PM", type: "Treatment", status: "Confirmed", date: "2025-09-16" },
    { id: 4, patient: "James Wilson", time: "1:15 PM", type: "Follow-up", status: "Confirmed", date: "2025-09-15" },
    { id: 5, patient: "Olivia Brown", time: "2:00 PM", type: "Consultation", status: "Scheduled", date: "2025-09-16" },
    { id: 6, patient: "Liam Smith", time: "2:45 PM", type: "Treatment", status: "Confirmed", date: "2025-09-15" },
    { id: 7, patient: "Sophia Davis", time: "3:30 PM", type: "Consultation", status: "Pending", date: "2025-09-15" },
    { id: 8, patient: "Noah Wilson", time: "4:00 PM", type: "Follow-up", status: "Confirmed", date: "2025-09-17" },
  ];

  // Sample reports data
  const reports = [
    { id: 1, patient: "Sarah Johnson", type: "CT Scan", doctor: "Dr. Smith", date: "2025-09-10", status: "Reviewed" },
    { id: 2, patient: "Michael Chen", type: "Mammography", doctor: "Dr. Adams", date: "2025-09-11", status: "Pending" },
    { id: 3, patient: "Emma Rodriguez", type: "Blood Test", doctor: "Dr. Lee", date: "2025-09-12", status: "Reviewed" },
    { id: 4, patient: "James Wilson", type: "MRI", doctor: "Dr. Smith", date: "2025-09-13", status: "Pending" },
    { id: 5, patient: "Olivia Brown", type: "Thyroid Scan", doctor: "Dr. Adams", date: "2025-09-14", status: "Reviewed" },
  ];

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter((apt) => apt.date === today);
  const pendingCount = todaysAppointments.filter((apt) => apt.status.toLowerCase() === "pending").length;

  // Messages tab states
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ sender: "Dr. Smith", recipient: "", subject: "", content: "" });
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const messages = [
    { id: 1, sender: "Dr. Adams", subject: "Lab Report Review", content: "Please check the recent CT scan reports.", date: "2025-09-14", unread: true },
    { id: 2, sender: "Nurse Emily", subject: "Patient Admission", content: "New patient admitted in Ward 3.", date: "2025-09-13", unread: false },
    { id: 3, sender: "Dr. Lee", subject: "Follow-up Reminder", content: "Reminder: Schedule follow-up for Sarah Johnson.", date: "2025-09-12", unread: true },
    { id: 4, sender: "Admin Office", subject: "Monthly Meeting", content: "Monthly oncology department meeting scheduled.", date: "2025-09-10", unread: false },
  ];

  const handleSendMessage = () => {
    if(newMessage.recipient && newMessage.subject && newMessage.content){
      messages.unshift({ 
        id: messages.length + 1, 
        sender: newMessage.sender, 
        subject: newMessage.subject, 
        content: newMessage.content, 
        date: new Date().toISOString().split("T")[0], 
        unread: true 
      });
      setNewMessage({ sender: "Dr. Smith", recipient: "", subject: "", content: "" });
      setShowCompose(false);
    } else {
      alert("Please fill all fields");
    }
  };

  const handleSendReply = (id) => {
    if(replyContent.trim() !== ""){
      alert(`Reply sent for message ID ${id}: ${replyContent}`);
      setReplyContent("");
      setReplyOpenId(null);
    } else {
      alert("Reply cannot be empty");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-overview">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <span className="stat-number">{patientData.length}</span>
                <span className="stat-trend up">+12%</span>
              </div>
              <div className="stat-card">
                <h3>Appointments Today</h3>
                <span className="stat-number">{todaysAppointments.length}</span>
                <span className="stat-trend">{pendingCount} pending</span>
              </div>
              <div className="stat-card">
                <h3>Critical Cases</h3>
                <span className="stat-number">{patientData.filter((p) => p.status === "Critical").length}</span>
                <span className="stat-trend down">-1</span>
              </div>
              <div className="stat-card">
                <h3>Prediction Accuracy</h3>
                <span className="stat-number">94%</span>
                <span className="stat-trend up">+2%</span>
              </div>
            </div>

            <div className="main-cards">
              <div className="card upcoming-appointments">
                <h2>Upcoming Appointments</h2>
                <ul>
                  {todaysAppointments.map((apt) => (
                    <li key={apt.id}>
                      <div className="apt-time">{apt.time}</div>
                      <div className="apt-info">
                        <div className="apt-patient">{apt.patient}</div>
                        <div className="apt-type">{apt.type}</div>
                      </div>
                      <div className={`apt-status ${apt.status.toLowerCase()}`}>{apt.status}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card critical-patients">
                <h2>Patients Needing Attention</h2>
                <ul>
                  {patientData.filter((p) => p.status === "Critical").map((patient) => (
                    <li key={patient.id} onClick={() => setSelectedPatient(patient)}>
                      <div className="patient-avatar">{patient.name.charAt(0)}</div>
                      <div className="patient-info">
                        <h4>{patient.name}</h4>
                        <p>{patient.condition} • {patient.age}y</p>
                      </div>
                      <div className="patient-status critical">Critical</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="prediction-tools">
              <h2>Prediction Tools</h2>
              <div className="tools-grid">
                <div className="tool-card">
                  <div className="tool-icon">🫁</div>
                  <h3>Lung Cancer Predictor</h3>
                  <p>Upload CT scans for immediate analysis</p>
                  <button>Run Analysis</button>
              
                </div>
                <div className="tool-card">
                  <div className="tool-icon">👩</div>
                  <h3>Breast Cancer Predictor</h3>
                  <p>Mammography analysis with 96% accuracy</p>
                  <button>Run Analysis</button>
                </div>
                <div className="tool-card">
                  <div className="tool-icon">🧬</div>
                  <h3>Genetic Risk Assessment</h3>
                  <p>Evaluate hereditary cancer risks</p>
                  <button>Run Analysis</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "patients":
        return (
          <div className="tab-content">
            <h2>Patient Records</h2>
            <div className="patients-table">
              <div className="table-header">
                <span>Name</span>
                <span>Age</span>
                <span>Condition</span>
                <span>Status</span>
                <span>Last Visit</span>
                <span>Actions</span>
              </div>
              {patientData.map((patient) => (
                <div key={patient.id} className="table-row">
                  <span>{patient.name}</span>
                  <span>{patient.age}</span>
                  <span>{patient.condition}</span>
                  <span className={`status ${patient.status.toLowerCase()}`}>{patient.status}</span>
                  <span>{patient.lastVisit}</span>
                  <span>
                    <button className="action-btn">View</button>
                    <button className="action-btn">Edit</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "appointments":
        const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
        const monthNames = [
          "January","February","March","April","May","June","July","August","September","October","November","December"
        ];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const todayDate = now.getDate();
        const totalDays = daysInMonth(currentYear, currentMonth);
        const calendarDays = Array.from({ length: totalDays }, (_, i) => i + 1);

        return (
          <div className="tab-content">
            <h2>Appointment Schedule</h2>
            <div className="calendar-view">
              <div className="calendar-header">
                <button>{`< Previous`}</button>
                <h3>{monthNames[currentMonth]} {currentYear}</h3>
                <button>{`Next >`}</button>
              </div>
              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const hasAppointment = appointments.some(
                    (apt) => new Date(apt.date).getDate() === day &&
                             new Date(apt.date).getMonth() === currentMonth
                  );
                  const isToday = day === todayDate;
                  return (
                    <div key={day} className={`calendar-day ${hasAppointment ? "has-apt" : ""} ${isToday ? "today" : ""}`}>
                      <span>{day}</span>
                      {hasAppointment && (
                        <ul>
                          {appointments
                            .filter(
                              (apt) =>
                                new Date(apt.date).getDate() === day &&
                                new Date(apt.date).getMonth() === currentMonth
                            )
                            .map((apt) => (
                              <li key={apt.id} className={`apt-status ${apt.status.toLowerCase()}`}>
                                {apt.time} - {apt.patient}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="tab-content">
            <h2>Patient Reports</h2>
            <div className="patients-table">
              <div className="table-header">
                <span>Patient</span>
                <span>Report Type</span>
                <span>Doctor</span>
                <span>Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {reports.map((report) => (
                <div key={report.id} className="table-row">
                  <span>{report.patient}</span>
                  <span>{report.type}</span>
                  <span>{report.doctor}</span>
                  <span>{report.date}</span>
                  <span className={`status ${report.status.toLowerCase()}`}>{report.status}</span>
                  <span>
                    <button className="action-btn">View</button>
                    <button className="action-btn">Download</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="tab-content">
            <h2>Analytics Overview</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Patient Growth</h3>
                <p>15% increase in last month</p>
              </div>
              <div className="analytics-card">
                <h3>Appointment Trends</h3>
                <p>Appointments up by 10%</p>
              </div>
              <div className="analytics-card">
                <h3>Critical Cases</h3>
                <p>3 new critical patients this week</p>
              </div>
              <div className="analytics-card">
                <h3>Prediction Accuracy</h3>
                <p>94% reliable predictions</p>
              </div>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="tab-content">
            <h2>Messages</h2>
            <button className="compose-btn" onClick={() => setShowCompose(!showCompose)}>
              {showCompose ? "Close Compose" : "New Message"}
            </button>

            {showCompose && (
              <div className="compose-panel">
                <input 
                  type="text" 
                  placeholder="Recipient" 
                  value={newMessage.recipient} 
                  onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={newMessage.subject} 
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })} 
                />
                <textarea 
                  placeholder="Message content..." 
                  value={newMessage.content} 
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })} 
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            )}

            <div className="messages-grid">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-card ${msg.unread ? "unread" : ""}`}>
                  <div className="msg-header">
                    <span className="msg-sender">{msg.sender}</span>
                    <span className="msg-date">{msg.date}</span>
                  </div>
                  <div className="msg-subject">{msg.subject}</div>
                  <div className="msg-content">{msg.content}</div>
                  <div className="msg-actions">
                    <button onClick={() => setReplyOpenId(replyOpenId === msg.id ? null : msg.id)}>Reply</button>
                    <button>Mark Read</button>
                  </div>

                  {replyOpenId === msg.id && (
                    <div className="reply-panel">
                      <textarea 
                        placeholder="Type your reply..." 
                        value={replyContent} 
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <button onClick={() => handleSendReply(msg.id)}>Send Reply</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="tab-content"><p>Tab content not available.</p></div>;
    }
  };

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>MediPredict</h1>
          <span>Oncology Dashboard</span>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input type="text" placeholder="Search patients, records..." />
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
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
              <span className="icon">📊</span> Dashboard
            </li>
            <li className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>
              <span className="icon">👨‍👩‍👧‍👦</span> Patients
            </li>
            <li className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>
              <span className="icon">📅</span> Appointments
            </li>
            <li className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>
              <span className="icon">📋</span> Reports
            </li>
            <li className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>
              <span className="icon">📈</span> Analytics
            </li>
            <li className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>
              <span className="icon">✉️</span> Messages
            </li>
          </ul>
        </nav>

        <main className="main-panel">{renderTabContent()}</main>
      </div>
    </div>
  );
};

export default MediPredictDashboard;
