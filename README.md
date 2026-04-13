# AI Resume Analyzer & Job Matching Platform

A professional full-stack application that leverages OpenAI and Google Gemini to analyze resumes against job descriptions, provide domain-specific insights, and suggest career growth roadmaps.

![Hero Preview](frontend/public/images/ai-bg.png)

## 🚀 Features

- **AI-Powered Analysis**: Uses GPT-4o for deep semantic matching and Gemini 1.5-Flash for summaries.
- **Domain Intelligence**: Targeted analysis for Web Dev, Data Science, AI/ML, DevOps, and more.
- **Project Suggestions**: Recommends real-world projects based on identified skill gaps.
- **Profile Management**: View and edit personal details, including profile photo upload.
- **Interactive Dashboard**: Track history of analyses with animated score charts.
- **Premium UI/UX**: Dark/Light mode support with smooth spring animations using Framer Motion.
- **PDF Reports**: Export detailed, multi-page analysis reports for offline review.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, Recharts.
- **Backend**: Node.js, Express, Multer, JWT Authentication.
- **Database**: SQLite (Default) / PostgreSQL support via unified query layer.
- **AI Integration**: OpenAI SDK, Google Generative AI SDK, `pdf-parse` (v2.x), `mammoth`.

## 📦 Project Structure

```text
/
├── frontend/          # React + Vite application
├── backend/           # Express server and services
├── uploads/           # Temporary storage for uploaded resumes
└── database.sqlite    # Local development database
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
# DB_TYPE=postgres (Optional: default is sqlite)
# DATABASE_URL= (Optional: if using postgres)
```
Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📄 API Usage

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/profile` - Get user profile (Protected)
- `POST /api/resumes/upload` - Upload a resume (Protected)
- `POST /api/analysis/run` - Run AI analysis (Protected)
- `GET /api/analysis/history` - Get user analysis history (Protected)

## 🔐 Security
The application uses JWT for session management and bcrypt for password hashing. Sensitive information like API keys should never be committed to version control.

## 📄 License
MIT
