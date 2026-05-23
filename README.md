# AI LearnHub – Smart AI Learning Platform & Digital Course Store

AI LearnHub is a next-generation full-stack educational technology (EdTech) platform and digital storefront designed to showcase advanced software construction and engineering practices. It integrates standard EdTech features (course browsing, simulated checkout, progress tracking) with custom AI modules (simulated AI tutors, automated quiz generators, personalized recommendation engines) and a comprehensive suite of academic software engineering documentation.

---

## 📂 Project Structure

```
focused-euclid/
├── backend/                  # Node.js + Express Backend
│   ├── package.json
│   ├── server.js             # Main server entrypoint
│   ├── src/
│   │   ├── config/           # SQLite DB Connection
│   │   ├── models/           # DB Schema & Database Initialization
│   │   ├── controllers/      # Route controllers (Auth, Courses, Quizzes, AI)
│   │   ├── routes/           # REST API routes
│   │   ├── middleware/       # JWT Auth and Express Error Handlers
│   │   └── services/         # Business logic (AI Simulator, Recommendation Engine)
│   └── tests/                # Jest Unit and Integration Tests
│
├── frontend/                 # React.js + Vite Frontend
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── assets/           # Typography, Images
│   │   ├── styles/           # Modern premium CSS (dark theme, glassmorphism)
│   │   ├── components/       # Common components (Navbar, Chatbot, CourseCard)
│   │   ├── pages/            # View pages (Home, Dashboard, CourseDetail, LearnPage)
│   │   ├── App.jsx           # Main routing
│   │   └── main.jsx          # Entrypoint
│
├── refactoring_demo/         # Code refactoring examples (before & after)
│   ├── legacy_recommender.js # Dusty, nested code
│   ├── clean_recommender.js  # Clean, SOLID-compliant code
│   └── explanation.md        # Refactoring analysis
│
├── docs/                     # University Semester Project Documents
│   ├── academic_report.md    # Ready-to-submit 12-section Software Engineering report
│   ├── presentation_slides.md# Presentation slide deck outline
│   ├── api_endpoints.md      # REST API documentation
│   └── database_schema.md    # Database schema diagram & descriptions
│
└── README.md                 # Main setup guide (This file)
```

---

## 🚀 Quick Start Guide

To run this application locally, you will need **Node.js** (v16 or higher) and **npm** installed on your machine.

### 1. Setup and Run the Backend Server
Open your terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm start
```
This will:
* Install the dependencies (`express`, `cors`, `sqlite3`, `jsonwebtoken`, `bcryptjs`).
* Automatically initialize the SQLite database file (`database.sqlite`).
* Pre-seed the database with high-quality digital course data.
* Start the API server on `http://localhost:5000`.

### 2. Run Backend Tests
To execute the automated unit and integration tests (Auth, Purchases, AI Quiz, and Recommendations):
```bash
cd backend
npm test
```

### 3. Setup and Run the Frontend Client
In a new terminal window, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
This will:
* Install Vite and React dependencies.
* Start the development server on `http://localhost:5173`.
* Proxy all `/api` requests to the backend server automatically.

Open `http://localhost:5173` in your browser to explore the platform!

---

## 💡 Simulated Testing Details

### 🔑 Student Accounts
* You can sign up using any email and password.
* Password must be at least **6 characters** long.

### 💳 Simulated Billing Details
During course checkout, you can test the global error handling middleware using these values:
* **Successful Purchase**: Enter any 16-digit card number (e.g. `4242 4242 4242 4242`).
* **Trigger Payment Decline Exception**: Enter any card number under 16 characters.
* **Trigger Insufficient Funds Exception**: Enter a card starting with `4002` (e.g. `4002 0000 0000 0000`).
* **50% Coupon Discount**: Enter promo code **`STUDENT50`**.
