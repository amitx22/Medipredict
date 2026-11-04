# 🏥 MediPredict – AI-Powered Oncology Dashboard

<p align="center">
  <strong>An Intelligent Healthcare Management & Cancer Prediction Platform</strong>
</p>

<p align="center">
  A full-stack healthcare dashboard designed to simplify oncology patient management, appointments, medical reports, analytics, and future AI-powered cancer prediction.
</p>

**Live Demo**:https://medipredict-hxoxkc2ct-virus21069-2800s-projects.vercel.app/

---

## 🚀 About the Project

**MediPredict** is a web-based healthcare management platform designed to help doctors and healthcare professionals manage oncology-related patient information efficiently.

The platform provides a centralized dashboard for managing patient records, scheduling appointments, maintaining medical reports, viewing analytics, and communicating through an integrated messaging interface.

The long-term vision of MediPredict is to integrate Machine Learning and Deep Learning models for cancer risk assessment and medical image analysis.

## ✨ Key Features

### 📊 1. Interactive Dashboard
- Total patient statistics.
- Daily appointment overview.
- Critical patient monitoring.
- Prediction accuracy demo metric.
- Centralized dashboard interface.

### 👨‍⚕️ 2. Patient Management
- Add new patient records.
- Manage patient information.
- Track medical conditions.
- Monitor patient health status.
- View previous visit information.

### 📅 3. Appointment Management
- Schedule appointments.
- Select appointment dates and times.
- Manage consultation types.
- Track appointment status.

### 📋 4. Medical Reports
- Add patient medical reports.
- Store report types and doctor information.
- Track report dates and review status.

### 💬 5. Messaging System
- Compose new messages.
- View received messages.
- Reply interface for communication.

### 📈 6. Analytics
- Patient growth overview.
- Appointment trends.
- Critical case statistics.
- Prediction accuracy demo metric.

### 🧠 7. AI Prediction Modules – Planned
- Lung Cancer Prediction using CT scan images.
- Breast Cancer Prediction using mammography images.
- Genetic Risk Assessment.

*Note: These prediction modules are currently UI placeholders. Actual trained AI/ML models are not yet integrated. The displayed 94% accuracy is a demo metric, not a validated model result.*

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript |
| Styling | CSS3 |
| Backend | Node.js, Express.js |
| API Communication | REST API, Fetch API |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Future AI/ML | Python, TensorFlow, Scikit-learn |

## 📂 Project Structure

```text
MediPredict/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── fdcotor/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── medipredictdashboard.jsx
│   │   ├── medipredictdashboard.css
│   │   └── ...
│   ├── package.json
│   └── README.md
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- Visual Studio Code

### 1. Clone Repository

```bash
git clone https://github.com/amitx22/Medipredict.git
```

### 2. Navigate to Project

```bash
cd Medipredict
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Start backend:

```bash
npm start
```

Backend runs locally at:

```text
http://localhost:5000
```

### 4. Setup Frontend

Open another terminal:

```bash
cd fdcotor
npm install
```

Start React application:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

## 🔗 Backend API Endpoints

Base URL:

```text
https://medipredict-4bkd.onrender.com/api
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients` | Fetch all patients |
| POST | `/patients` | Add a new patient |
| GET | `/appointments` | Fetch appointments |
| POST | `/appointments` | Create appointment |
| GET | `/reports` | Fetch medical reports |
| POST | `/reports` | Add medical report |
| GET | `/messages` | Fetch messages |
| POST | `/messages` | Send a message |
| GET | `/analytics` | Fetch analytics |

## 🏗️ System Architecture

```text
         React Frontend
                |
                |
       MediPredict Dashboard
                |
                |
          REST API Calls
                |
                |
       Node.js + Express
                |
                |
         API Endpoints
                |
                |
       Application Data
```

Future AI/ML architecture:

```text
Medical Image / Patient Data
             |
             v
       Python ML API
             |
             v
     Trained ML Models
             |
             v
      Prediction Results
             |
             v
      React Dashboard
```

## 🌐 Deployment

**Frontend:** Vercel

**Backend:** Render

**GitHub Repository:**

https://github.com/amitx22/Medipredict

**Backend API:**

https://medipredict-4bkd.onrender.com

*Note: The backend currently uses in-memory sample data. A persistent database and production-grade security are future improvements.*

## 🔮 Future Enhancements

- [ ] Integrate trained Lung Cancer Detection model.
- [ ] Integrate Breast Cancer Prediction model.
- [ ] Develop Genetic Risk Assessment module.
- [ ] Integrate MongoDB for persistent storage.
- [ ] Implement secure authentication and authorization.
- [ ] Add medical image upload functionality.
- [ ] Implement real-time messaging.
- [ ] Add doctor and patient role management.
- [ ] Improve analytics with interactive visualizations.

## 🔒 Security & Medical Disclaimer

MediPredict is currently an educational and development project.

It is not intended to replace professional medical diagnosis or clinical decision-making. No cancer prediction functionality should be considered clinically validated until appropriate models undergo rigorous validation and regulatory review.

Do not upload real patient medical records to the current demo deployment.

## 👨‍💻 Developer

**Amit Kumar Singh**

- GitHub: https://github.com/amitx22

---

<p align="center">
  <strong>Built with ❤️ for smarter healthcare management.</strong>
</p>

<p align="center">
  ⭐ If you find MediPredict interesting, consider giving this repository a star!
</p>
