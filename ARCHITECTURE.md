# Architecture & Technical Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (User)                            │
│                      http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ App.jsx (Main Container)                                │   │
│  │  ├─ DailyLogPanel.jsx (Journal + Analysis)             │   │
│  │  │  ├─ BurnoutMeter.jsx                                │   │
│  │  │  └─ StressTriggers.jsx                              │   │
│  │  └─ ChatPanel.jsx (AI Companion Chat)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  State: journalText, mood, analysis, messages, loading          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Fetch API Calls
                              │ /api/journal
                              │ /api/chat
                              │ /api/health
                              │ /api/session
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                Express.js Backend Server                         │
│                  http://localhost:5000                           │
│                                                                   │
│  Middleware:                                                      │
│  ├─ CORS (Cross-Origin Resource Sharing)                        │
│  └─ express.json() (JSON body parser)                           │
│                                                                   │
│  Endpoints:                                                       │
│  ├─ POST /api/journal                                           │
│  │   └─► sessionStore.lastJournalAnalysis                       │
│  ├─ POST /api/chat                                              │
│  │   └─► sessionStore.chatHistory                               │
│  ├─ GET /api/session                                            │
│  └─ GET /api/health                                             │
│                                                                   │
│  State Management:                                                │
│  └─ sessionStore (in-memory object)                             │
│     ├─ lastJournalAnalysis                                      │
│     ├─ userProfile                                              │
│     └─ chatHistory                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls with prompt
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           Google Generative AI (Gemini 1.5 Flash)               │
│                                                                   │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║ Analysis Pipeline:                                          ║ │
│  ║ 1. Receives: journal text + mood score                    ║ │
│  ║ 2. Prompt: "Extract stress triggers, emotional patterns" ║ │
│  ║ 3. Generates: JSON with triggers, patterns, burnout risk ║ │
│  ║ 4. Returns: Structured analysis response                 ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                   │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║ Companion Chat Pipeline:                                   ║ │
│  ║ 1. Receives: user message + context                       ║ │
│  ║ 2. Context: last mood + detected triggers                 ║ │
│  ║ 3. Prompt: "Provide empathetic, personalized response"   ║ │
│  ║ 4. Returns: Natural language wellness support             ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Journal Analysis Flow
```
User Input (Journal + Mood)
        │
        ▼
DailyLogPanel (React State)
        │
        ├─► Validation (text length, mood range)
        │
        └─► POST /api/journal {text, mood}
                    │
                    ▼
            Backend Validation
                    │
                    ▼
            Construct Gemini Prompt
                    │
                    ▼
            Call Gemini 1.5 Flash API
                    │
                    ▼
            Receive JSON Response
                    │
                    ├─► Sanitize Output (remove markdown)
                    │
                    ├─► Parse JSON
                    │
                    └─► Store in sessionStore.lastJournalAnalysis
                            │
                            ▼
                        Return to Frontend
                            │
                            ▼
                        Update React State (analysis)
                            │
                            ▼
                        Render BurnoutMeter
                        Render Emotional Pattern
                        Render StressTriggers
```

### Chat Companion Flow
```
User Message (Chat Input)
        │
        ▼
ChatPanel (React State)
        │
        ├─► Validation (message length)
        │
        ├─► Display User Message (optimistic)
        │
        └─► POST /api/chat {message}
                    │
                    ▼
            Backend Processing
                    │
                    ├─► Get sessionStore.lastJournalAnalysis
                    │   (Extract: lastMood, triggers)
                    │
                    ├─► Construct Contextual Prompt
                    │   "You are companion. Context: mood={x}, triggers={y}"
                    │
                    ├─► Call Gemini 1.5 Flash API
                    │
                    ├─► Store User Message in chatHistory
                    │
                    ├─► Store AI Response in chatHistory
                    │
                    └─► Return Response to Frontend
                            │
                            ▼
                        Update React State (messages)
                            │
                            ▼
                        Render Chat Bubbles
                        Scroll to Bottom
```

---

## Component Hierarchy

```
App.jsx
├─ Header
│  └─ Title + Subtitle
├─ Main (Dashboard Grid)
│  ├─ Column A: DailyLogPanel
│  │  ├─ Panel Header (Title + Profile)
│  │  ├─ Journal Section
│  │  │  └─ Textarea Input
│  │  ├─ Mood Section
│  │  │  ├─ Range Slider
│  │  │  └─ Mood Display
│  │  ├─ Analyze Button
│  │  └─ Analysis Results (Conditional)
│  │     ├─ BurnoutMeter
│  │     │  └─ Progress Bar + Label
│  │     ├─ Emotional Pattern Card
│  │     └─ StressTriggers
│  │        └─ Tag Grid
│  │
│  └─ Column B: ChatPanel
│     ├─ Panel Header (Title + Status)
│     ├─ Messages Container
│     │  ├─ Welcome Message
│     │  ├─ Message Bubbles (User)
│     │  ├─ Message Bubbles (Companion)
│     │  └─ Typing Indicator (Conditional)
│     └─ Chat Input Area
│        ├─ Textarea Input
│        └─ Send Button
│
└─ Footer
   └─ Copyright + Disclaimer
```

---

## State Management Pattern

### React Component State (Frontend)

**DailyLogPanel State:**
```javascript
{
  journalText: string,      // User's journal entry
  mood: number,             // 1-10 mood score
  loading: boolean,         // API call in progress
  analysis: object | null,  // {burnoutRisk, emotionalPatterns, hiddenTriggers, ...}
  error: string | null      // Error message
}
```

**ChatPanel State:**
```javascript
{
  messages: [
    {
      id: number,
      role: 'user' | 'companion',
      text: string,
      timestamp: Date,
      isError?: boolean
    }
  ],
  inputMessage: string,     // Current input box content
  loading: boolean          // API call in progress
}
```

### Server-Side Session Store (Backend)

```javascript
sessionStore = {
  userProfile: {
    targetExam: 'JEE Advanced'
  },
  lastJournalAnalysis: {
    timestamp: ISO8601,
    mood: number,
    hiddenTriggers: string[],
    emotionalPatterns: string,
    burnoutRisk: 'Low' | 'Medium' | 'High'
  },
  chatHistory: [
    {
      timestamp: ISO8601,
      role: 'user' | 'companion',
      message: string
    }
  ]
}
```

---

## API Request/Response Structures

### POST /api/journal

**Request:**
```typescript
{
  text: string,    // Journal entry (required, 1+ chars)
  mood: number     // 1-10 (required, validated)
}
```

**Success Response (200):**
```typescript
{
  success: true,
  analysis: {
    timestamp: ISO8601String,
    mood: number,
    hiddenTriggers: string[],
    emotionalPatterns: string,
    burnoutRisk: 'Low' | 'Medium' | 'High'
  }
}
```

**Error Response (400/500):**
```typescript
{
  error: string,
  message?: string
}
```

### POST /api/chat

**Request:**
```typescript
{
  message: string   // Chat message (required, 1+ chars)
}
```

**Success Response (200):**
```typescript
{
  success: true,
  response: string,  // AI companion response
  context: {
    lastMood: number,
    triggers: string[]
  }
}
```

---

## Prompt Engineering Details

### Journal Analysis Prompt

```
Analyze this open-ended journal entry and mood score (${mood}/10) from a student 
preparing for high-stakes competitive exams. Extract underlying stress points that 
a standard tracker would miss.

Return strictly a raw JSON object (no markdown wrappers) with three keys:
- 'hiddenTriggers': array of specific strings like subjects, test types, or lifestyle factors
- 'emotionalPatterns': concise 1-sentence diagnostic synthesis
- 'burnoutRisk': 'Low', 'Medium', or 'High'

Journal Entry:
${journalText}
```

### Companion Chat Prompt

```
You are an empathetic, always-available digital companion for a student preparing 
for highly competitive exams.

CURRENT STUDENT CONTEXT:
- Last Logged Mood: ${lastMood}/10
- AI-Detected Triggers: ${triggers.join(', ')}

CRITICAL DIRECTIVES:
1. Act safely as an empathetic digital companion throughout their academic journey.
2. Provide hyper-personalized, contextual wellness support. Do not genericize.
3. Proactively reference their known stress triggers if relevant to help them 
   navigate hidden anxieties.
4. Offer real-time tailored coping strategies, adaptive mindfulness exercises, 
   or motivational encouragement based heavily on their current states.
5. Keep responses concise, comforting, and grounded. Do not give clinical medical 
   diagnoses.

Student's Message:
${userMessage}
```

---

## Error Handling Strategy

### Frontend Error Handling
```javascript
try {
  const response = await fetch('/api/endpoint');
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
  
  const data = await response.json();
  // Process success
} catch (err) {
  // Display user-friendly error message
  setError(err.message);
}
```

### Backend Error Handling
```javascript
// Endpoint validation
if (!text || text.trim().length === 0) {
  return res.status(400).json({ error: 'Required fields missing' });
}

// API call error handling
try {
  const result = await model.generateContent(prompt);
  // Process result
} catch (error) {
  console.error('API Error:', error);
  return res.status(500).json({ error: 'Failed to process' });
}

// Global error middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

### Output Sanitization
```javascript
function sanitizeAIOutput(text) {
  if (!text) return text;
  // Remove markdown code blocks and language identifiers
  return text.replace(/```json\n?|\n?```/g, '').trim();
}

function safeParseJSON(jsonString) {
  try {
    const sanitized = sanitizeAIOutput(jsonString);
    return JSON.parse(sanitized);
  } catch (error) {
    // Return fallback structure
    return {
      hiddenTriggers: ['Unable to parse'],
      emotionalPatterns: 'Unable to complete analysis.',
      burnoutRisk: 'Medium'
    };
  }
}
```

---

## Performance Optimizations

### Frontend
- **React.StrictMode** for development warnings
- **Conditional Rendering** (analysis only shows when available)
- **CSS Animations** use `transform` and `opacity` (GPU accelerated)
- **Scrollbar Styling** custom for performance
- **Event Debouncing** on slider (optional future enhancement)

### Backend
- **Gemini 1.5 Flash** model (fast, cost-effective)
- **Session Store** in-memory (ultra-fast access)
- **Request Validation** before API calls (reduce waste)
- **Error Fallbacks** prevent cascade failures
- **Middleware Ordering** (fast rejection before processing)

### Network
- **CORS Headers** enable client-side caching
- **JSON Compression** (gzip in production)
- **API Aggregation** (journal + chat context in single endpoint call)

---

## Security Measures

1. **API Key Management**
   - Environment variables only
   - Never in source code
   - Rotation recommended quarterly

2. **Input Validation**
   - Text length limits
   - Mood range validation (1-10)
   - Type checking

3. **Output Sanitization**
   - Markdown removal
   - No HTML injection risk (React escapes)
   - Safe JSON parsing

4. **CORS Configuration**
   ```javascript
   // Development
   app.use(cors());
   
   // Production
   app.use(cors({ origin: 'https://yourdomain.com' }));
   ```

5. **Privacy**
   - Session-scoped data only
   - No logging of sensitive content
   - Optional: implement data deletion after session

---

## Scaling Strategy

### Phase 1 (Current - MVP)
- In-memory session store
- Single server instance
- Suitable for: Small group testing, prototyping

### Phase 2 (Scaling Up)
- Replace sessionStore with Redis
- Add user authentication
- Multi-server with load balancing
- Database: MongoDB for mood history
- Suitable for: 100-1000 concurrent users

### Phase 3 (Production)
- Microservices architecture
- Separate analysis and chat services
- Caching layer (Redis)
- CDN for static assets
- Analytics service
- Suitable for: 10,000+ users

---

## Testing Strategy (Optional Future)

### Frontend Tests
- Unit tests: Component rendering, state updates
- Integration tests: API calls, error handling
- E2E tests: User flows (journal → analysis → chat)

### Backend Tests
- Unit tests: Sanitization, validation
- Integration tests: Endpoint responses
- Error scenarios: Network failures, API timeouts

### Tools
- Jest for testing framework
- React Testing Library for components
- Supertest for API endpoints

---

## Deployment Checklist

- [ ] API key configured in production environment
- [ ] CORS domain specified
- [ ] NODE_ENV=production
- [ ] Frontend built (npm run build)
- [ ] Database setup (if upgrading from session store)
- [ ] Rate limiting configured
- [ ] Error logging enabled
- [ ] HTTPS enforced
- [ ] Health check endpoint monitored
- [ ] Backup strategy in place
