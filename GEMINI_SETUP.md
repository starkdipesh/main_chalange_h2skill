# Gemini API Setup & Integration Guide

## Getting Your Free Gemini API Key

### Step 1: Create Google Account
- If you don't have a Google account, create one at [accounts.google.com](https://accounts.google.com)

### Step 2: Access Google AI Studio
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key" button

### Step 3: Configure Your Key
- Copy the generated API key
- Keep it secure (don't share or commit to git)
- You can regenerate it anytime from the dashboard

### Step 4: Add to Your Backend
```bash
cd backend

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_copied_key_here_without_quotes
PORT=5000
NODE_ENV=development
EOF
```

### Step 5: Verify Installation
```bash
npm install
npm start

# You should see:
# 🚀 Mental Wellness Tracker Backend running on port 5000
# API Key configured: true
```

---

## Free Tier Limits

### Requests
- **Requests per minute:** 60
- **Requests per day:** Unlimited
- **Concurrent requests:** 10

### Model: gemini-1.5-flash
- **Input tokens:** $0.075 per 1M tokens
- **Output tokens:** $0.30 per 1M tokens
- **Free tier:** 15,000 requests/month at no cost

### Upgrading (If Needed)
- Visit [Google Cloud Console](https://console.cloud.google.com)
- Enable billing
- Upgrade plan
- Limits increase automatically

---

## Integration Details

### How the App Uses Gemini

#### 1. Journal Analysis
```javascript
// server.js - POST /api/journal

const analysisPrompt = `
Analyze this open-ended journal entry and mood score (${mood}/10) 
from a student preparing for high-stakes competitive exams. 
Extract underlying stress points that a standard tracker would miss. 

Return strictly a raw JSON object (no markdown wrappers) with three keys:
- 'hiddenTriggers': array of specific strings
- 'emotionalPatterns': 1-sentence diagnostic
- 'burnoutRisk': 'Low', 'Medium', or 'High'

Journal Entry:
${text}`;

const result = await model.generateContent(analysisPrompt);
```

**Expected Response:**
```json
{
  "hiddenTriggers": ["Mock Exams", "Organic Chemistry", "Sleep Deprivation"],
  "emotionalPatterns": "Student shows academic pressure with physical exhaustion.",
  "burnoutRisk": "High"
}
```

#### 2. Chat Companion
```javascript
// server.js - POST /api/chat

const companionPrompt = `
You are an empathetic, always-available digital companion...

CURRENT STUDENT CONTEXT:
- Last Logged Mood: ${lastMood}/10
- AI-Detected Triggers: ${triggers.join(', ')}

[DIRECTIVES...]

Student's Message:
${message}`;

const result = await model.generateContent(companionPrompt);
```

**Expected Response:**
Natural language response with empathy and personalized support.

---

## Testing Your Integration

### Manual API Testing

#### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"...","environment":"development"}
```

#### Test 2: Journal Analysis
```bash
curl -X POST http://localhost:5000/api/journal \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am struggling with my exam preparation. Sleep deprived and stressed.",
    "mood": 3
  }'

# Should return analysis with triggers, patterns, and risk level
```

#### Test 3: Chat
```bash
# First analyze a journal (as above)
# Then test chat:

curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I manage my stress?"
  }'

# Should return empathetic response
```

### Frontend Testing

#### Test 1: Journal Flow
1. Open http://localhost:3000
2. Type journal entry
3. Set mood slider
4. Click "Analyze Wellness"
5. Verify results display (burnout meter, triggers, pattern)

#### Test 2: Chat Flow
1. Type message in chat input
2. Click "Talk" button
3. Verify response appears in chat
4. Type another message
5. Chat should reference previous context

### Debugging Tips

#### Issue: "GEMINI_API_KEY is not defined"
```bash
# Check .env file exists
cat backend/.env

# Verify key is present and valid
echo $GEMINI_API_KEY

# If empty, re-export
export GEMINI_API_KEY="your_key_here"
npm start
```

#### Issue: API Returns Error
```bash
# Check logs for detailed error
npm start > logs.txt 2>&1

# Common errors:
# 1. Invalid API key - regenerate at makersuite.google.com
# 2. Rate limited - wait a minute, try again
# 3. Network issue - check internet connection
```

#### Issue: Timeout Error
- Gemini might be slow during peak hours
- Implement retry logic (backend already has fallback)
- Consider upgrading API quota

---

## Cost Tracking

### Monitor Usage
Visit [Google Cloud Console](https://console.cloud.google.com):
1. Select your project
2. Go to "APIs & Services" → "Credentials"
3. Check "API usage and quota"
4. View daily/monthly costs

### Estimate Costs
- **Average journal analysis:** ~100 input tokens + 50 output tokens
- **Average chat message:** ~200 input tokens + 100 output tokens
- **Cost per interaction:** $0.005 - $0.015

### Free Tier Covers
- ~100 journal analyses/day
- ~200 chat messages/day
- Completely free up to 15,000 requests/month

---

## Model Selection

### Why gemini-1.5-flash?

| Aspect | flash | pro |
|--------|-------|-----|
| Speed | ⚡⚡⚡ Fast | ⚡⚡ Medium |
| Cost | 💰 Cheap | 💰💰 Expensive |
| Quality | ✅ Good | ✅✅ Better |
| Context | 1M tokens | 1M tokens |

**For this app:** flash is perfect - fast enough and cost-effective.

**If you need better quality:** Switch to `gemini-1.5-pro` in `server.js`:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

---

## Advanced Configuration

### Timeout Handling
```javascript
// In server.js, add timeout for Gemini calls:
const result = await Promise.race([
  model.generateContent(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 30000)
  )
]);
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const journalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // max 10 journal analyses per minute
});

app.post('/api/journal', journalLimiter, async (req, res) => {
  // ... endpoint code
});
```

### Custom System Role
```javascript
// For more specialized behavior:
const customPrompt = `
You are Dr. Wellness, a specialized digital companion for 
exam-prep students with 10+ years of clinical experience.

Your role is to:
1. Validate emotions without judgment
2. Provide evidence-based stress management
3. Encourage professional help when needed

...rest of prompt
`;
```

---

## Troubleshooting Gemini Integration

| Issue | Solution |
|-------|----------|
| API Key invalid | Regenerate at makersuite.google.com |
| Rate limited | Wait 1 minute, retry, or upgrade quota |
| Empty response | Check prompt format, add fallback structure |
| Markdown in JSON | Sanitize output with `sanitizeAIOutput()` |
| Timeout | Implement retry with exponential backoff |
| Wrong response format | Validate response before parsing |

---

## Production Considerations

### API Key Security
```javascript
// ✅ Correct (Environment Variable)
const apiKey = process.env.GEMINI_API_KEY;

// ❌ Wrong (Hardcoded)
const apiKey = "AIzaSy...";

// ❌ Wrong (Visible in Client)
fetch('/api/journal', {
  headers: { 'X-API-Key': 'AIzaSy...' }
});
```

### Caching Responses (Advanced)
```javascript
import redis from 'redis';
const client = redis.createClient();

app.post('/api/journal', async (req, res) => {
  const cacheKey = `journal:${req.body.text.slice(0, 50)}:${req.body.mood}`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  // Get from Gemini
  const analysis = await /* gemini call */;
  
  // Cache for 24 hours
  await client.setex(cacheKey, 86400, JSON.stringify(analysis));
  
  return res.json({ success: true, analysis });
});
```

---

## Alternative AI Models (If Needed)

### OpenAI GPT-4
```bash
npm install openai
```

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
});
```

### Anthropic Claude
```bash
npm install @anthropic-ai/sdk
```

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});
```

---

## Support & Resources

### Official Documentation
- [Google Generative AI SDK](https://ai.google.dev/tutorials/node_quickstart)
- [Gemini API Reference](https://ai.google.dev/api)
- [Prompt Engineering Guide](https://ai.google.dev/tutorials/prompt_engineering)

### Community & Help
- [Google AI Forum](https://groups.google.com/g/google-ai-sdks)
- [GitHub Issues](https://github.com/google/generative-ai-js)
- Stack Overflow: Tag `google-generative-ai`

### Billing Questions
- [Google Cloud Pricing](https://cloud.google.com/generative-ai/pricing)
- [Support Page](https://support.google.com/cloud)

---

**Congratulations! Your Gemini integration is complete.** 🎉

Next: Run the application and start analyzing wellness! 🚀
