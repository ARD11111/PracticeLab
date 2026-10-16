# PracticeLab 🚀

> **Adaptive Learning & Spaced-Repetition Platform for Algorithmic Problem Solving**

PracticeLab is a full-stack platform designed to help software engineers and students master Data Structures & Algorithms (DSA). By combining pattern-oriented problem curation, spaced-repetition scheduling (SM-2 algorithm), interactive analytics, and a companion Chrome extension, PracticeLab ensures long-term retention rather than short-term memorization.

---

## 🌟 Key Features

- **🧠 Spaced Repetition Engine (SM-2 Algorithm)**: Dynamically calculates optimal review intervals based on performance and confidence ratings to lock concepts into long-term memory.
- **🗺️ Pattern-Based DSA Roadmap**: Problems categorized by algorithmic paradigms (Two Pointers, Sliding Window, Dynamic Programming, Graphs, Backtracking, etc.).
- **🧩 Companion Chrome Extension**: Seamlessly log problem attempts and practice sessions directly from online judges (e.g., LeetCode) into your PracticeLab dashboard.
- **📊 Real-Time Analytics & Heatmaps**: Track activity streaks, retention rates, pattern mastery percentages, and revision queues.
- **📬 Automated Email Notifications**: Daily spaced-repetition reminders powered by scheduled background cron jobs and Nodemailer.
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/client`)
- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS & modern design tokens
- **Routing**: React Router DOM
- **Icons & Data**: Lucide React / Recharts

### Backend (`/server`)
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Scheduling**: Node-cron (daily review reminders)
- **Email**: Nodemailer (SMTP)
- **Auth**: JSON Web Tokens (JWT) & bcryptjs

### Extension (`/extension`)
- **Platform**: Manifest V3 Chrome Extension
- **Capabilities**: Active tab inspection, quick session logging, and direct sync with the PracticeLab API.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/ARD11111/PracticeLab.git
cd PracticeLab
```

### 2. Install Dependencies
You can install dependencies for root, client, and server at once:
```bash
npm run install:all
```
Or install them individually:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Environment Configuration
Create a `.env` file inside the `server/` directory (or use `.env.example` as a template):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/practicelab
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="PracticeLab <noreply@practicelab.dev>"
```

### 4. Seed Canonical 150 DSA Problems & Patterns
Populate your database with curated patterns and problems:
```bash
npm run seed
```

### 5. Run the Application
Run both server and client concurrently from the root directory:
```bash
npm start
```
- Client runs at: `http://localhost:5173`
- Server API runs at: `http://localhost:5000`

### 6. Chrome Extension Setup
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and select the `/extension` directory from this project.

---

## 📂 Project Directory Structure

```text
PracticeLab/
├── client/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/  # Layout, Sidebar, Calendar, etc.
│   │   ├── pages/       # Dashboard, PatternMap, ReviewQueue, Analytics, etc.
│   │   ├── services/    # Axios API client
│   │   └── styles/      # Design system & styles
├── server/              # Express backend API & MongoDB models
│   ├── controllers/     # Route handlers for auth, problems, reviews, etc.
│   ├── middleware/      # JWT authentication middleware
│   ├── models/          # Mongoose schemas (User, Problem, Pattern, etc.)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Seed data and verification scripts
│   └── services/        # SM-2 engine, mailer, analytics
├── extension/           # Manifest V3 Chrome Extension
│   ├── background/      # Service worker
│   ├── content/         # Content scripts
│   └── popup/           # Popup interface
└── package.json         # Root scripts & orchestration
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
