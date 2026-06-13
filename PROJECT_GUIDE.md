# Complete Project File Listing & Reference

## 📁 Project Structure Overview

```
mental-wellness-tracker/
├── README.md                    # Main documentation (you are here)
├── QUICKSTART.md               # 5-minute setup guide
├── ARCHITECTURE.md             # System design & data flow
├── DEPLOYMENT.md               # Production deployment guide
├── FEATURES.md                 # Complete feature specifications
├── GEMINI_SETUP.md             # Google Gemini API setup
│
├── backend/                    # Node.js + Express server
│   ├── server.js               # Main application file
│   ├── package.json            # Dependencies & scripts
│   ├── .env.example            # Environment template
│   ├── .gitignore             # Git ignore rules
│   └── README.md              # Backend-specific docs
│
└── frontend/                   # React + Vite app
    ├── index.html              # HTML entry point
    ├── vite.config.js          # Vite configuration
    ├── package.json            # Dependencies & scripts
    ├── .gitignore             # Git ignore rules
    │
    ├── public/                # Static assets (currently empty)
    │
    └── src/                   # React source code
        ├── main.jsx           # React entry point
        ├── index.css          # Global styles
        ├── App.jsx            # Main app component
        ├── App.css            # App layout styles
        │
        └── components/        # Reusable components
            ├── DailyLogPanel.jsx         # Journal & analysis
            ├── DailyLogPanel.css         # Daily log styles
            ├── ChatPanel.jsx             # Chat interface
            ├── ChatPanel.css             # Chat styles
            ├── BurnoutMeter.jsx          # Risk meter
            ├── BurnoutMeter.css          # Risk meter styles
            ├── StressTriggers.jsx        # Trigger tags
            └── StressTriggers.css        # Trigger styles
```

---

## 📄 Backend Files (Detailed)

### `backend/server.js` (431 lines)
**Purpose:** Main Express.js server file

**Key Exports:**
- None (executable file)

**Key Functions:**
- `sanitizeAIOutput(text)` - Remove markdown wrappers from AI output
- `safeParseJSON(jsonString)` - Parse JSON with fallback handling

**Endpoints:**
- `POST /api/journal` - Analyze journal entry
- `POST /api/chat` - Chat with AI companion
- `GET /api/session` - Get current session state
- `GET /api/health` - Health check

**Dependencies:**
- `express` - Web framework
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `@google/generative-ai` - Gemini API client

**Configuration:**
- Port: 5000 (configurable via .env)
- CORS: Allow all origins (dev only)
- Middleware: JSON body parser + CORS headers

---

### `backend/package.json`
**Purpose:** Node.js dependencies and project metadata

**Key Fields:**
- `main`: `"server.js"`
- `type`: `"module"` (ES modules)
- `scripts`:
  - `start`: Runs server in production
  - `dev`: Runs with file watcher (--watch)

**Dependencies:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google/generative-ai": "^0.3.0"
}
```

---

### `backend/.env.example`
**Purpose:** Template for environment variables

**Required Variables:**
```
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

**Instructions:**
1. Copy to `.env`
2. Replace `your_google_gemini_api_key_here` with actual key
3. Do NOT commit `.env` to git

---

### `backend/.gitignore`
**Purpose:** Prevent committing sensitive/unnecessary files

**Patterns:**
- `node_modules/` - Dependencies
- `.env` - Local environment variables
- `.env.local` - Local overrides
- `.DS_Store` - macOS system files
- `*.log` - Log files
- `npm-debug.log*` - npm debug logs

---

## 📄 Frontend Files (Detailed)

### `frontend/src/main.jsx` (11 lines)
**Purpose:** React application entry point

**Key Code:**
- Imports React and ReactDOM
- Renders `App` component to `#root` DOM element
- Wrapped in `StrictMode` for development warnings

---

### `frontend/src/index.css` (24 lines)
**Purpose:** Global styles

**Key Styles:**
- HTML/body height: 100% (full viewport)
- Background: Dark slate (#0f172a)
- Font family: System fonts
- Color: Light slate (#e2e8f0)

---

### `frontend/src/App.jsx` (55 lines)
**Purpose:** Main application component

**Key Components:**
- Health check on mount
- Header with title
- Main dashboard grid
- Two-column layout (responsive)
- Footer with disclaimer

**State:**
- `loading`: Whether backend is responsive

**Features:**
- Automatic backend connection verification
- Loading spinner while checking health
- Responsive grid layout

---

### `frontend/src/App.css` (180+ lines)
**Purpose:** App layout and global component styles

**Key Classes:**
- `.app-container` - Main flex container
- `.app-header` - Top navigation area
- `.app-main` - Content area
- `.dashboard-grid` - Two-column layout
- `.app-footer` - Bottom section
- `.app-loading` - Loading screen
- `.spinner` - Animated spinner

**Colors & Gradients:**
- Background: `linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%)`
- Primary accent: Indigo (#4f46e5)
- Secondary accent: Cyan (#06b6d4)

---

### `frontend/src/components/DailyLogPanel.jsx` (123 lines)
**Purpose:** Journal entry and wellness analysis component

**Key Functions:**
- `handleAnalyze()` - Send journal to backend for analysis

**State:**
- `journalText` - User's journal entry
- `mood` - Selected mood (1-10)
- `loading` - API call in progress
- `analysis` - Parsed results
- `error` - Error message

**Sub-components:**
- `BurnoutMeter` - Risk visualization
- `StressTriggers` - Tag display

**Features:**
- Real-time mood emoji updates
- Validation before sending
- Error display and recovery

---

### `frontend/src/components/DailyLogPanel.css` (325+ lines)
**Purpose:** Daily log panel styling

**Key Classes:**
- `.journal-textarea` - Input styling
- `.mood-slider` - Range input with gradient
- `.btn-analyze` - Analysis button
- `.analysis-results` - Results card
- `.error-message` - Error display

**Animations:**
- `slideIn` - Results appear
- `spin` - Loading spinner

---

### `frontend/src/components/ChatPanel.jsx` (145 lines)
**Purpose:** Chat interface component

**Key Functions:**
- `handleSendMessage()` - Send message to chat endpoint
- `scrollToBottom()` - Auto-scroll to latest message
- `handleKeyPress()` - Send on Enter key

**State:**
- `messages` - Array of chat messages
- `inputMessage` - Current input text
- `loading` - API call in progress

**Features:**
- Auto-scroll to latest message
- Welcome message on load
- Typing indicator
- Message timestamps
- Error recovery

---

### `frontend/src/components/ChatPanel.css` (280+ lines)
**Purpose:** Chat interface styling

**Key Classes:**
- `.chat-panel` - Main container
- `.chat-messages` - Message display area
- `.message` - Individual message
- `.message-bubble` - Chat bubble styling
- `.message-user` - User message styling
- `.message-companion` - AI response styling
- `.chat-input-area` - Input section
- `.btn-send` - Send button

**Animations:**
- `messageAppear` - Messages slide in
- `typing` - Typing indicator dots bounce

---

### `frontend/src/components/BurnoutMeter.jsx` (51 lines)
**Purpose:** Burnout risk visualization component

**Key Functions:**
- `getRiskColor(level)` - Color based on risk
- `getRiskPercentage(level)` - Bar fill width
- Descriptive message generation

**Props:**
- `riskLevel` - 'Low', 'Medium', or 'High'

**Features:**
- Color-coded visual bar
- Contextual guidance message
- Smooth animations

---

### `frontend/src/components/BurnoutMeter.css` (47 lines)
**Purpose:** Burnout meter styling

**Key Classes:**
- `.burnout-meter` - Container
- `.meter-bar` - Progress bar background
- `.meter-fill` - Animated fill
- `.meter-label` - Risk text

---

### `frontend/src/components/StressTriggers.jsx` (51 lines)
**Purpose:** Stress trigger tag display component

**Key Functions:**
- `getEmoji(trigger)` - Match trigger to emoji

**Props:**
- `triggers` - Array of trigger strings

**Features:**
- Emoji assignment based on keywords
- Flex-wrap grid layout
- Pop-in animation on render

---

### `frontend/src/components/StressTriggers.css` (70 lines)
**Purpose:** Stress trigger tag styling

**Key Classes:**
- `.stress-triggers` - Container
- `.triggers-grid` - Flex grid
- `.trigger-tag` - Individual tag

**Animations:**
- `popIn` - Tag appears with scale effect

---

### `frontend/vite.config.js` (21 lines)
**Purpose:** Vite build tool configuration

**Key Settings:**
- Port: 3000
- API proxy to `/api` → `http://localhost:5000`
- Source maps disabled for production

---

### `frontend/index.html`
**Purpose:** HTML template

**Key Elements:**
- Meta tags for responsiveness
- `<div id="root">` for React mounting
- Script tag for main.jsx

---

### `frontend/package.json`
**Purpose:** Frontend dependencies and scripts

**Key Scripts:**
- `dev` - Start Vite dev server
- `build` - Build for production
- `preview` - Preview production build

**Dependencies:**
- `react` ^18.2.0
- `react-dom` ^18.2.0

**Dev Dependencies:**
- `vite` ^5.0.8
- `@vitejs/plugin-react` ^4.2.1

---

## 📚 Documentation Files

### `README.md`
**Length:** 450+ lines
**Covers:**
- Project overview and features
- Technology stack
- Installation instructions
- API endpoint documentation
- Architecture overview
- Troubleshooting guide
- Security considerations
- Future enhancements

---

### `QUICKSTART.md`
**Length:** 70+ lines
**Covers:**
- 5-minute setup
- Prerequisites
- Step-by-step instructions
- Common port issues
- Quick troubleshooting

---

### `ARCHITECTURE.md`
**Length:** 800+ lines
**Covers:**
- System architecture diagram
- Data flow diagrams
- Component hierarchy
- State management patterns
- API structures
- Prompt engineering details
- Error handling strategy
- Performance optimizations
- Security measures
- Scaling strategy

---

### `DEPLOYMENT.md`
**Length:** 600+ lines
**Covers:**
- Pre-deployment checklist
- Backend deployment options (Render, Railway, Heroku, VPS)
- Frontend deployment options (Vercel, Netlify, GitHub Pages)
- Database migration guide
- Environment variables
- Monitoring and logging
- Performance optimization
- Security hardening
- Troubleshooting
- Rollback procedures
- Cost estimation

---

### `FEATURES.md`
**Length:** 700+ lines
**Covers:**
- Complete feature breakdown
- Specification for each component
- Risk level definitions
- Emoji mapping
- Responsive design breakpoints
- Accessibility features
- Performance features
- UX details
- Testing scenarios
- Future roadmap
- Metrics to track

---

### `GEMINI_SETUP.md`
**Length:** 400+ lines
**Covers:**
- Getting Gemini API key
- Free tier limits
- Integration details
- Testing procedures
- Debugging tips
- Cost tracking
- Model selection
- Advanced configuration
- Troubleshooting
- Alternative AI models

---

## 🔑 Key Files by Purpose

### To Start Development
1. `QUICKSTART.md` - Get running in 5 minutes
2. `backend/.env.example` - Add your API key
3. `backend/server.js` - Understand endpoints
4. `frontend/src/App.jsx` - Understand components

### To Deploy
1. `DEPLOYMENT.md` - Choose hosting platform
2. Set environment variables
3. Run build commands
4. Deploy frontend and backend

### To Understand Architecture
1. `ARCHITECTURE.md` - Read system design
2. `server.js` - See endpoint implementations
3. `components/` - See React patterns

### To Debug Issues
1. `README.md` - Troubleshooting section
2. `GEMINI_SETUP.md` - API issues
3. Server logs - Backend errors
4. Browser console - Frontend errors

---

## 📊 Code Statistics

| Type | Count | Total Lines |
|------|-------|------------|
| **Backend** | | |
| server.js | 1 | 431 |
| package.json | 1 | 21 |
| Configuration | 2 | 11 |
| **Frontend** | | |
| main.jsx | 1 | 11 |
| App.jsx | 1 | 55 |
| Components | 4 | 370 |
| CSS files | 6 | 1000+ |
| Config | 3 | 25 |
| **Documentation** | | |
| README.md | 1 | 450+ |
| QUICKSTART.md | 1 | 70+ |
| ARCHITECTURE.md | 1 | 800+ |
| DEPLOYMENT.md | 1 | 600+ |
| FEATURES.md | 1 | 700+ |
| GEMINI_SETUP.md | 1 | 400+ |
| **TOTAL** | **~26 files** | **~6,400 lines** |

---

## 🎯 Quick Reference Map

### If you need to...

**Add a new feature**
1. Update `FEATURES.md` with spec
2. Create component or modify `server.js`
3. Add CSS file or update existing
4. Test locally
5. Update deployment guide if needed

**Fix a bug**
1. Check browser/server console for errors
2. Review relevant `.jsx` or `server.js`
3. Look at `ARCHITECTURE.md` for flow
4. Test changes
5. Verify with curl or browser

**Deploy to production**
1. Read `DEPLOYMENT.md` fully
2. Choose hosting platform
3. Set environment variables
4. Run build commands
5. Follow platform-specific instructions

**Improve performance**
1. Read optimization section in `ARCHITECTURE.md`
2. Profile with browser DevTools
3. Check network requests
4. Optimize code/styling
5. Measure improvement

**Add database**
1. Read database migration in `DEPLOYMENT.md`
2. Choose MongoDB, PostgreSQL, or Firebase
3. Update `server.js` endpoints
4. Test thoroughly
5. Update documentation

---

## 🚀 Next Steps

1. **Read:** `QUICKSTART.md`
2. **Setup:** Follow 5-minute guide
3. **Run:** Start both servers
4. **Test:** Use browser or curl
5. **Explore:** Try all features
6. **Deploy:** Read `DEPLOYMENT.md` when ready

---

Generated: 2024
Version: 1.0.0
Status: Production-Ready 🎉
