# MediCure — Smart Medicine Supply Chain

> Google Solution Challenge 2026 | Solving medicine shortages in rural Indian PHCs using AI

![MediCure Dashboard](https://img.shields.io/badge/Google_Solution_Challenge-2026-4285F4?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)

---

## The Problem

Over 25,000 Primary Health Centers (PHCs) in rural India face chronic medicine shortages. Stock management is done manually on paper registers, leading to:
- Medicines running out before reorders are placed
- Expiry wastage due to poor tracking
- No visibility into consumption patterns or seasonal demand spikes

## The Solution

MediCure is an AI-powered supply chain management system that:
- **Predicts stockouts** before they happen using Google Gemini AI
- **Automates reorder suggestions** based on consumption trends and seasonal patterns
- **Provides real-time visibility** across multiple PHC locations
- **Assists PHC staff** via an AI chat assistant in simple language

---

## Features

- **Dashboard** — Live stats, consumption trend charts, PHC network map, alerts
- **Inventory Management** — Full CRUD with Firebase Firestore persistence
- **AI Predictions** — Gemini 2.5 Flash analyzes stock and predicts stockouts with seasonal context
- **Order Management** — Create orders, track status with timeline view
- **Reports** — AI-generated narrative reports with charts
- **Chat Assistant** — Gemini-powered assistant for PHC staff queries

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS, Recharts |
| Backend Proxy | Node.js + Express |
| Database | Firebase Firestore |
| AI | Google Gemini 2.5 Flash |
| Hosting | Firebase Hosting |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)
- A Firebase project with Firestore enabled

### Installation

```bash
git clone https://github.com/Dipro-cyber/MediCure.git
cd MediCure
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
REACT_APP_GEMINI_KEY=your_gemini_api_key

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Running Locally

You need two terminals:

**Terminal 1 — React app:**
```bash
npm start
```

**Terminal 2 — Gemini proxy server:**
```bash
npm run server
```

Open [http://localhost:3000](http://localhost:3000)

---

## Google Technologies Used

- **Google Gemini 2.5 Flash** — AI predictions, chat assistant, report generation
- **Firebase Firestore** — Real-time database for medicine inventory
- **Firebase Hosting** — Production deployment

---

## Team

Built for **Google Solution Challenge 2026**

---

*MediCure — Because no patient should suffer due to an empty medicine shelf.*
