import React, { useState, useEffect } from "react";
import "./medipredictdashboard.css";
import axios from "axios";

const API_URL = "https://medipredict-4bkd.onrender.com/api"; // backend base URL

const MediPredictDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // States to hold data from backend
  const [patientData, setPatientData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes, reportsRes, messagesRes, analyticsRes] = await Promise.all([
          axios.get(`${API_URL}/patients`),
          axios.get(`${API_URL}/appointments`),
          axios.get(`${API_URL}/reports`),
          axios.get(`${API_URL}/messages`),
          axios.get(`${API_URL}/analytics`)
        ]);

        setPatientData(patientsRes.data);
        setAppointments(appointmentsRes.data);
        setReports(reportsRes.data);
        setMessages(messagesRes.data);
        setAnalytics(analyticsRes.data);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter((apt) => apt.date === today);
  const pendingCount = todaysAppointments.filter((apt) => apt.status.toLowerCase() === "pending").length;

  // Messages tab states
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ sender: "Dr. Smith", recipient: "", subject: "", content: "" });
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.recipient && newMessage.subject && newMessage.content) {
      try {
        const res = await axios.post(`${API_URL}/messages`, newMessage);
        setMessages([res.data, ...messages]);
        setNewMessage({ sender: "Dr. Smith", recipient: "", subject: "", content: "" });
        setShowCompose(false);
      } catch (err) {
        alert("Error sending message");
      }
    } else {
      alert("Please fill all fields");
    }
  };

  const handleSendReply = (id) => {
    if (replyContent.trim() !== "") {
      alert(`Reply sent for message ID ${id}: ${replyContent}`);
      setReplyContent("");
      setReplyOpenId(null);
    } else {
      alert("Reply cannot be empty");
    }
  };

  // --- Render code same as your original, just replace hardcoded arrays with state ---
  // Example: patientData, appointments, reports, messages, analytics
  // ... your renderTabContent() and JSX goes here ...
  // All instances of hardcoded arrays should now use these states

  return (
    <div className="doctor-dashboard">
      {/* Dashboard header, sidebar, and main-panel JSX remains same */}
      {/* Use patientData, appointments, reports, messages, analytics */}
    </div>
  );
};

export default MediPredictDashboard;
