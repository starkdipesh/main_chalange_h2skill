# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- Google Gemini API Key (get free at [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))

### Step 1: Get API Key (1 minute)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API key"
3. Copy the key

### Step 2: Setup Backend (2 minutes)
```bash
cd backend
npm install
echo "GEMINI_API_KEY=YOUR_KEY_HERE" > .env
echo "PORT=5000" >> .env
npm run dev
```

### Step 3: Setup Frontend (1 minute)
```bash
cd ../frontend
npm install
npm run dev
```

### Step 4: Open & Enjoy!
Visit **http://localhost:3000** in your browser

---

## 📱 First Use

1. **Write in Journal:** Share your exam prep thoughts, stress, sleep quality
2. **Set Mood:** Slide to indicate your energy level (1-10)
3. **Click Analyze:** Let AI analyze and extract insights
4. **Chat:** Talk to your wellness companion anytime

---

## 🔑 API Key Issues?

If you get "GEMINI_API_KEY is not defined":

1. Make sure you're in the `backend` folder
2. Verify `.env` file exists with your actual API key
3. Check key format: `GEMINI_API_KEY=abc123xyz...`
4. Restart backend server

---

## 🌐 Common Ports

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

If ports are busy, edit:
- Frontend: `frontend/vite.config.js` → change `port: 3000`
- Backend: `backend/.env` → change `PORT=5000`

---

## ✨ That's It!

You now have a fully functional AI-powered mental wellness tracker. Start journaling and let the AI help you through exam prep! 🎓
