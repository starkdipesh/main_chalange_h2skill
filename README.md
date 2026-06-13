# Mental Wellness Tracker 🌿

A production-ready, full-stack AI-powered mental wellness tracking application designed specifically for students preparing for high-stakes competitive entrance exams (NEET, JEE, CUET, CAT, GATE, UPSC).

## Overview

The Mental Wellness Tracker replaces shallow, traditional check-box trackers with an intuitive, calming, and deeply analytical AI-powered ecosystem. It leverages Google's Gemini API to act as a clinical-grade wellness parsing engine and an empathetic digital companion throughout the student's exam preparation journey.

## Key Features

### 📝 Daily Wellness Log
- Open-ended journaling with unlimited expression
- Mood/energy slider (1-10 scale)
- Real-time AI analysis of journal entries
- **Burnout Risk Meter** with color-coded risk levels (Low, Medium, High)
- **Emotional Pattern Summary** synthesized by AI
- **Stress Trigger Extraction** displayed as visual tags

### 💬 AI-Powered Wellness Companion Chat
- Always-available chatbot for real-time support
- Contextually aware responses based on current mood and triggers
- Personalized coping strategies and mindfulness exercises
- Hyper-personalized wellness recommendations

### 🎯 Smart Context Management
- Server-side state persistence
- Real-time synchronization between journal analysis and chat
- Historical mood tracking
- Session-based conversation context

---

## Technology Stack

**Frontend:**
- React 18 with Hooks
- Vite build tool
- CSS3 with modern animations
- Responsive design (mobile-first)

**Backend:**
- Node.js + Express.js
- Google Generative AI SDK (`@google/generative-ai`)
- CORS enabled for security
- RESTful API design

**AI Engine:**
- Google Gemini 1.5 Flash model
- Advanced prompt engineering for wellness analysis
- JSON structured outputs

---

## Installation & Setup

### Prerequisites

- **Node.js** 16+ and npm
- **Google Gemini API Key** (free tier available at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your Google Gemini API key
nano .env  # or use your preferred editor
```

**In `.env`, add:**
```
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 - Frontend (New Terminal):**
```bash
cd frontend
npm run dev
# App starts on http://localhost:3000
```

Open your browser and visit: **http://localhost:3000**

---

## API Endpoints

### 1. POST `/api/journal`
Analyzes journal entry and mood, extracts stress triggers.

**Request:**
```json
{
  "text": "I'm struggling with organic chemistry and haven't slept well this week...",
  "mood": 4
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "timestamp": "2024-01-20T10:30:00.000Z",
    "mood": 4,
    "hiddenTriggers": [
      "Organic Chemistry",
      "Sleep Deprivation",
      "Mock Exam Anxiety"
    ],
    "emotionalPatterns": "Student shows signs of academic pressure combined with physical exhaustion.",
    "burnoutRisk": "High"
  }
}
```

### 2. POST `/api/chat`
Sends a message to the AI companion with contextual awareness.

**Request:**
```json
{
  "message": "How can I manage my stress about chemistry?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I see you're feeling overwhelmed by organic chemistry right now...",
  "context": {
    "lastMood": 4,
    "triggers": ["Organic Chemistry", "Sleep Deprivation"]
  }
}
```

### 3. GET `/api/session`
Retrieve current session state.

**Response:**
```json
{
  "userProfile": {
    "targetExam": "JEE Advanced"
  },
  "lastAnalysis": {
    "timestamp": "2024-01-20T10:30:00.000Z",
    "mood": 4,
    "hiddenTriggers": [...],
    "emotionalPatterns": "...",
    "burnoutRisk": "High"
  },
  "chatHistoryLength": 5
}
```

### 4. GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:35:15.000Z",
  "environment": "development"
}
```

---

## Project Structure

```
mental-wellness-tracker/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   └── .gitignore            # Git ignore rules
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main React component
│   │   ├── App.css                    # App styling
│   │   ├── main.jsx                   # Entry point
│   │   ├── index.css                  # Global styles
│   │   └── components/
│   │       ├── DailyLogPanel.jsx      # Journal & analysis
│   │       ├── DailyLogPanel.css      # Daily log styling
│   │       ├── ChatPanel.jsx          # Chat interface
│   │       ├── ChatPanel.css          # Chat styling
│   │       ├── BurnoutMeter.jsx       # Risk meter component
│   │       ├── BurnoutMeter.css       # Risk meter styling
│   │       ├── StressTriggers.jsx     # Stress tags component
│   │       └── StressTriggers.css     # Stress tags styling
│   ├── public/                # Static assets
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Frontend dependencies
│   └── .gitignore           # Git ignore rules
│
└── README.md                 # This file
```

---

## UI/UX Design Features

### Visual Design Language
- **Color Palette:**
  - Dark Slate Background: `#0f172a`, `#1e293b`
  - Indigo Primary: `#4f46e5`
  - Cyan Accent: `#06b6d4`
  - Emerald Highlight: `#10b981`
  - Light Slate Text: `#e2e8f0`

- **Typography:**
  - System fonts for optimal readability
  - Clear hierarchy with 3-4 font sizes
  - 1.5 line-height for accessibility

### Component Design
- **Glassmorphism Effects:** Subtle transparency with border accents
- **Smooth Animations:** Fade-in, slide-in, pop-in transitions
- **Interactive Feedback:** Hover states, active states, disabled states
- **Accessibility:** Proper color contrast, keyboard navigation support

---

## How It Works

### Daily Wellness Log Flow
1. Student writes freely about their day, stress, and preparation
2. Student sets their mood/energy level (1-10)
3. Clicks **"Analyze Wellness"** button
4. Backend sends text and mood to Gemini API
5. AI extracts stress triggers, emotional patterns, and burnout risk
6. Results display instantly with visual indicators
7. Analysis is stored for chat context

### Chat Companion Flow
1. Student types a message in the chat input
2. Backend constructs a contextual prompt with current mood and triggers
3. Gemini generates personalized response
4. Response appears with timestamp
5. Conversation history is maintained

---

## Troubleshooting

### Issue: "GEMINI_API_KEY is not defined"
**Solution:** Ensure `.env` file exists in backend folder with valid API key

### Issue: CORS errors in console
**Solution:** Backend is not running or PORT mismatch. Verify backend on http://localhost:5000

### Issue: "Failed to analyze journal"
**Solution:** 
- Check Gemini API quota and rate limits
- Verify API key is valid
- Check journal text length

### Issue: Chat not responding
**Solution:** Ensure journal has been analyzed first

---

## Security Considerations

1. **API Key Protection:**
   - Never commit `.env` file
   - Use environment variables in production
   - Rotate keys regularly

2. **CORS Configuration:**
   - Specify frontend domain in production

3. **Input Validation:**
   - All endpoints validate user inputs
   - Sanitize outputs to prevent injection

4. **Privacy:**
   - No long-term data storage (session-scoped)
   - No user authentication required (can be added)

---

## Future Enhancements

- User authentication and profiles
- Historical mood tracking with charts
- Export wellness reports (PDF)
- Scheduled wellness reminders
- Mobile app (React Native)
- Voice journaling
- Integration with therapy platforms

---

## License

MIT License - Free for personal and educational use.

---

**Remember:** This app is a wellness companion, not a substitute for professional mental health care. If you're experiencing severe anxiety or suicidal thoughts, please reach out to a qualified professional.

Happy learning! 🎓✨