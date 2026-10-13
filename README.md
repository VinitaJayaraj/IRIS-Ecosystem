# 🌐 IRIS - Intelligent Responsive Individualized Study Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

**IRIS** is a multi-agent AI-powered personalized learning ecosystem. It combines a Next.js frontend with specialized AI mentors, interactive widgets (code sandboxes, LaTeX math chalkboards, science simulations), a custom RAG (Retrieval-Augmented Generation) pipeline, and a high-performance Python FastAPI + SQLite backend with an administrative portal.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Setup Instructions](#-step-by-step-setup-instructions)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Frontend Setup (Next.js)](#2-frontend-setup-nextjs)
  - [3. Backend Setup (FastAPI & SQLite)](#3-backend-setup-fastapi--sqlite)
- [Running the Application](#-running-the-application)
- [Admin Portal & Credentials](#-admin-portal--credentials)
- [Project Directory Structure](#-project-directory-structure)
- [API Documentation](#-api-documentation)
- [Technical Architecture & Diagrams](#-technical-architecture--diagrams)
- [License](#-license)

---

## 🌟 Core Features

- **6 Specialized AI Mentors**:
  - 🧮 **Mathematics**: Step-by-step Socratic problem solving with interactive LaTeX chalkboard rendering.
  - 🧪 **Science**: Multi-disciplinary lab experiments and physics/chemistry simulations.
  - 💻 **Coding Coach**: Interactive Monaco-style code sandbox with algorithmic syntax highlighting and bug fixing.
  - 📖 **Literature & Rhetoric**: Essay critique, argumentative rhetoric analysis, and vocabulary development.
  - 🎯 **Career Strategist**: Resume analysis, interview simulations, and skill gap roadmaps.
  - 🔬 **Research Assistant**: IEEE/APA citation generator and academic research synthesis.
- **RAG (Retrieval-Augmented Generation) Pipeline**:
  - Ingestion, semantic chunking, TF-IDF / vector cosine similarity indexing, and multi-tier knowledge retrieval.
- **Interactive Widgets**:
  - Real-time Code Editor, Mathematical LaTeX Chalkboard, Science Simulations, Career Roadmaps, and Citation Generator.
- **Student Analytics & Profile (IRIS DNA)**:
  - Cognitive mastery tracking, spaced repetition planners, dynamic task scheduling, and performance analytics.
- **Admin Control & Governance Portal**:
  - Knowledge base management, RAG retrieval inspector, audit logging, system settings, and SQLite database explorer.

---

## 🏗️ System Architecture

```text
[ Browser / Client ] (Port 3000)
       │
       ├─── Next.js 15 (App Router, React 19, TypeScript)
       │      ├─ AI Tutor Views & Chat Interface
       │      ├─ Interactive Widgets (Math, Code, Science)
       │      ├─ Internal RAG Pipeline & Vector Index
       │      └─ Admin Portal & Analytics Dashboard
       │
       └─── FastAPI Service (Port 8000)
              ├─ Relational SQLite Persistence (iris.db)
              ├─ User Authentication & Sessions
              ├─ Tutor Management & Chat Log Persistence
              └─ Live Database Inspector & Schema APIs
```

---

## 📋 Prerequisites

Before running the project, make sure you have installed:

- **Node.js**: `v18.17.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm** or **yarn** / **pnpm**
- **Python**: `3.10` or higher ([Download Python](https://www.python.org/))
- **Git**: Installed and configured on your system

---

## 🚀 Step-by-Step Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/VinitaJayaraj/IRIS-Ecosystem.git
cd IRIS-Ecosystem
```

---

### 2. Frontend Setup (Next.js)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (Optional)**:
   Create a `.env.local` file in the root directory if you want to use external AI providers:
   ```env
   # Optional: OpenAI API Key for live AI generation
   OPENAI_API_KEY=your_openai_api_key_here

   # Optional: Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: IRIS includes a built-in offline knowledge engine and deterministic fallbacks that run fully out-of-the-box without API keys).*

---

### 3. Backend Setup (FastAPI & SQLite)

1. **Navigate to the project root and create a Python virtual environment**:
   ```bash
   # Windows PowerShell / CMD
   python -m venv backend/venv

   # Activate the virtual environment:
   # On Windows:
   .\backend\venv\Scripts\activate
   # On macOS/Linux:
   source backend/venv/bin/activate
   ```

2. **Install backend dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Database Initialization**:
   The SQLite database (`iris.db`) initializes and seeds automatically upon starting the FastAPI application.

---

## 💻 Running the Application

For full functionality (frontend and backend persistence), run both services:

### Terminal 1: Start Frontend Server
```bash
npm run dev
```
- Frontend will be available at: **[http://localhost:3000](http://localhost:3000)**

### Terminal 2: Start Backend Server
```bash
# Ensure virtual environment is activated
uvicorn backend.main:app --reload --port 8000
```
- Backend API will be available at: **[http://localhost:8000](http://localhost:8000)**
- Interactive Swagger API docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**
- Redoc API docs: **[http://localhost:8000/redoc](http://localhost:8000/redoc)**

---

## 🔐 Admin Portal & Credentials

IRIS includes a dedicated administrative dashboard for controlling knowledge documents, inspecting RAG retrievals, and monitoring database operations.

1. Navigate to: **[http://localhost:3000/admin](http://localhost:3000/admin)**
2. Default Administrator Credentials:
   - **Email:** `admin@iris.edu`
   - **Password:** `Admin@123456`

---

## 📂 Project Directory Structure

```text
IRIS-Ecosystem/
├── backend/                  # FastAPI Backend Services
│   ├── database.py           # SQLite connection, schemas, and queries
│   ├── main.py               # API endpoints, auth, and DB inspector
│   └── requirements.txt      # Python dependencies
├── public/                   # Static assets & icons
├── src/
│   ├── app/
│   │   ├── admin/            # Admin login and dashboard portal
│   │   │   ├── dashboard/    # System metrics, RAG monitor, logs
│   │   │   └── login/        # 2FA admin authentication
│   │   ├── api/
│   │   │   ├── admin/        # Admin RAG and knowledge base endpoints
│   │   │   └── chat/         # Primary AI chat & RAG execution route
│   │   ├── globals.css       # Design system and Tailwind/CSS variables
│   │   ├── layout.tsx        # Root Next.js layout and providers
│   │   └── page.tsx          # Main student learning workspace
│   ├── components/           # Reusable UI widgets & views
│   │   ├── AgentsView.tsx    # 6 AI Mentor personas selector
│   │   ├── AssessmentView.tsx# Adaptive quizzes and assessments
│   │   ├── AuthView.tsx      # Student login & registration
│   │   ├── DashboardView.tsx # Analytics, study metrics & streak
│   │   ├── NotebookWorkspace.tsx # Multi-tab student notes & editor
│   │   ├── PlannerView.tsx   # Spaced repetition study planner
│   │   └── ...
│   ├── context/              # React Context Providers
│   │   ├── AdminContext.tsx  # Admin state & governance
│   │   └── LearningContext.tsx # Student session & progress state
│   └── lib/
│       ├── knowledgeBase.ts  # Fallback offline knowledge bank
│       └── rag/              # Retrieval-Augmented Generation Engine
│           ├── embeddings.ts # Vector calculation & similarity
│           ├── ingestion.ts  # Document parsing & chunking
│           ├── intentDetector.ts # Query classification
│           ├── ragPipeline.ts# Multi-stage retrieval & synthesis
│           └── vectorStore.ts# Vector database indexing
├── .gitignore                # Ignored files (node_modules, pycache, .db)
├── package.json              # Frontend npm dependencies & scripts
├── README.md                 # Project guide & instructions
├── TECHNOLOGY_STACK.md       # Full architecture & ER diagrams
└── tsconfig.json             # TypeScript configuration
```

---

## 📖 API Documentation

When the FastAPI server is running (`localhost:8000`), you can access live documentation:

| Endpoint | Description |
| :--- | :--- |
| `GET /docs` | Interactive Swagger UI for testing all REST endpoints |
| `GET /redoc` | ReDoc interactive technical specification |
| `POST /api/v1/auth/login` | Authenticate user and issue session token |
| `GET /api/v1/tutors` | List all 6 AI tutors with persona attributes |
| `POST /api/v1/conversations` | Log conversation history with AI mentors |
| `GET /api/v1/profile/{user_id}` | Retrieve student learning DNA and mastery progress |
| `GET /api/v1/db/stats` | Live SQLite database table sizes and record counts |
| `GET /api/v1/db/tables/{table}` | Schema and paginated rows from database |

---

## 📚 Technical Architecture & Diagrams

For deep technical details, refer to **[TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)**:

- **Database Schemas & Field Specs**: Detailed column types, primary keys, and relations for `iris_users`, `iris_session`, `iris_conversations`, `iris_dna`, and `iris_tasks`.
- **Entity Relationship (ER) Diagram**: Mermaid diagram of all database entities.
- **System Execution Sequence**: End-to-end data flow from user prompt to vector retrieval and UI widget generation.
- **Layered Architecture**: Client, API Gateway, Service Layer, and Storage Layer breakdown.

---

## 📄 License

This project is licensed under the MIT License.
