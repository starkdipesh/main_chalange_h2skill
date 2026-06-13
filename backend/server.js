import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Server-side state store (mock database for current session)
const sessionStore = {
  lastJournalAnalysis: null,
  userProfile: {
    targetExam: 'JEE Advanced',
  },
  chatHistory: [],
};

/**
 * Sanitize AI text output by removing markdown code blocks
 */
function sanitizeAIOutput(text) {
  if (!text) return text;
  // Remove markdown code fences and language identifiers
  return text.replace(/```json\n?|\n?```/g, '').trim();
}

/**
 * Safely parse JSON from AI output
 */
function safeParseJSON(jsonString) {
  try {
    const sanitized = sanitizeAIOutput(jsonString);
    return JSON.parse(sanitized);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    // Return fallback structure if parsing fails
    return {
      hiddenTriggers: ['Unable to parse stress triggers'],
      emotionalPatterns: 'Unable to complete analysis at this time.',
      burnoutRisk: 'Medium',
    };
  }
}

/**
 * POST /api/journal
 * Analyzes journal entry and mood, extracts stress triggers and burnout risk
 */
app.post('/api/journal', async (req, res) => {
  try {
    const { text, mood } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Journal text is required' });
    }

    if (mood === undefined || mood < 1 || mood > 10) {
      return res.status(400).json({ error: 'Mood must be between 1 and 10' });
    }

    let analysis;

    // Try Gemini API first
    try {
      // Construct detailed system prompt for analysis
      const analysisPrompt = `Analyze this open-ended journal entry and mood score (${mood}/10) from a student preparing for high-stakes competitive exams. Extract underlying stress points that a standard tracker would miss. Return strictly a raw JSON object (no markdown wrappers) with three keys: 'hiddenTriggers' (an array of specific strings like subjects, test types, or lifestyle factors), 'emotionalPatterns' (a concise 1-sentence diagnostic synthesis), and 'burnoutRisk' ('Low', 'Medium', or 'High').

Journal Entry:
${text}`;

      // Call Gemini API for analysis
      const result = await model.generateContent(analysisPrompt);
      const responseText = result.response.text();

      // Parse and validate response
      analysis = safeParseJSON(responseText);
    } catch (apiError) {
      console.error('Gemini API Error:', apiError.message);
      
      // Fallback: Generate mock analysis based on keywords
      const triggers = [];
      const textLower = text.toLowerCase();
      
      if (textLower.includes('sleep') || textLower.includes('tired')) triggers.push('Sleep Deprivation');
      if (textLower.includes('exam') || textLower.includes('test')) triggers.push('Mock Exams');
      if (textLower.includes('math') || textLower.includes('chemistry') || textLower.includes('physics')) triggers.push('Subject Difficulty');
      if (textLower.includes('anxiety') || textLower.includes('stressed')) triggers.push('Academic Anxiety');
      if (textLower.includes('score') || textLower.includes('marks')) triggers.push('Performance Pressure');
      if (triggers.length === 0) triggers.push('General Academic Stress');

      const riskMapping = {
        1: 'High', 2: 'High', 3: 'Medium', 4: 'Medium', 5: 'Low',
        6: 'Low', 7: 'Low', 8: 'Low', 9: 'Low', 10: 'Low'
      };

      analysis = {
        hiddenTriggers: triggers,
        emotionalPatterns: mood <= 3 
          ? 'Student exhibits signs of acute stress and burnout with potential need for immediate wellness intervention.'
          : mood <= 6
          ? 'Student shows moderate stress levels with some coping mechanisms in place.'
          : 'Student demonstrates good stress management and positive emotional resilience.',
        burnoutRisk: riskMapping[mood] || 'Medium'
      };
    }

    // Store in session for chat endpoint access
    sessionStore.lastJournalAnalysis = {
      timestamp: new Date().toISOString(),
      mood,
      ...analysis,
    };

    return res.json({
      success: true,
      analysis: sessionStore.lastJournalAnalysis,
    });
  } catch (error) {
    console.error('Journal Analysis Error:', error);
    return res.status(500).json({
      error: 'Failed to analyze journal entry',
      message: error.message,
    });
  }
});

/**
 * POST /api/chat
 * Contextual chat endpoint using current journal analysis and mood
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current context from session
    const lastMood = sessionStore.lastJournalAnalysis?.mood || 5;
    const triggers =
      sessionStore.lastJournalAnalysis?.hiddenTriggers || [];

    let companionResponse;

    // Try Gemini API first
    try {
      // Build contextual system prompt
      const companionPrompt = `You are an empathetic, always-available digital companion for a student preparing for highly competitive exams. 

CURRENT STUDENT CONTEXT:
- Last Logged Mood: ${lastMood}/10
- AI-Detected Triggers: ${triggers.length > 0 ? triggers.join(', ') : 'No triggers logged yet'}

CRITICAL DIRECTIVES:
1. Act safely as an empathetic digital companion throughout their academic journey.
2. Provide hyper-personalized, contextual wellness support. Do not genericize.
3. Proactively reference their known stress triggers if relevant to help them navigate hidden anxieties.
4. Offer real-time tailored coping strategies, adaptive mindfulness exercises, or motivational encouragement based heavily on their current states.
5. Keep responses concise, comforting, and grounded. Do not give clinical medical diagnoses.

Student's Message:
${message}`;

      // Call Gemini API for companionship response
      const result = await model.generateContent(companionPrompt);
      companionResponse = result.response.text();
    } catch (apiError) {
      console.error('Gemini Chat API Error:', apiError.message);
      
      // Fallback: Generate empathetic response based on keywords
      const messageLower = message.toLowerCase();
      let response = '';
      
      if (messageLower.includes('stress') || messageLower.includes('anxious')) {
        response = `I hear that you're feeling stressed. That's completely normal for exam prep. Let me help you work through this. Since you mentioned ${triggers.length > 0 ? `your struggles with ${triggers[0]}` : 'your challenges'}, here are some immediate strategies: Take a 5-minute breathing break, break your study into 25-minute focused sessions, and remember that progress over perfection is the goal. You've got this! 💪`;
      } else if (messageLower.includes('sleep') || messageLower.includes('tired')) {
        response = `Sleep is crucial for cognitive performance and memory retention. Your brain needs 7-9 hours to consolidate what you've learned. Consider setting a strict bedtime, avoiding screens 1 hour before bed, and creating a consistent sleep schedule. Quality rest is productive rest!`;
      } else if (messageLower.includes('motivation') || messageLower.includes('discouraged')) {
        response = `Remember why you started this journey. Every exam topper has faced moments of doubt. The fact that you're tracking your wellness shows you care about sustainable success. You're building resilience along with knowledge. Keep going! 🌟`;
      } else if (messageLower.includes('thank') || messageLower.includes('help')) {
        response = `I'm here for you whenever you need support. Whether it's during stressful exam prep or celebrating your wins, I'm your companion. Keep taking care of yourself - your wellbeing is just as important as your scores.`;
      } else {
        response = `That's thoughtful of you to share. ${triggers.length > 0 ? `I noticed you're dealing with ${triggers[0]} - that can definitely be challenging.` : 'Exam prep is a marathon, not a sprint.'} Remember to balance your study with adequate rest and exercise. How can I best support you right now?`;
      }
      
      companionResponse = response;
    }

    // Store in chat history
    sessionStore.chatHistory.push({
      timestamp: new Date().toISOString(),
      role: 'user',
      message,
    });

    sessionStore.chatHistory.push({
      timestamp: new Date().toISOString(),
      role: 'companion',
      message: companionResponse,
    });

    return res.json({
      success: true,
      response: companionResponse,
      context: {
        lastMood,
        triggers,
      },
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    });
  }
});

/**
 * GET /api/session
 * Retrieve current session state (for debugging or frontend sync)
 */
app.get('/api/session', (req, res) => {
  res.json({
    userProfile: sessionStore.userProfile,
    lastAnalysis: sessionStore.lastJournalAnalysis,
    chatHistoryLength: sessionStore.chatHistory.length,
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mental Wellness Tracker Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Key configured: ${!!process.env.GEMINI_API_KEY}`);
});
