const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL || 'gemini-pro',
  'gemini-1.5-pro',
  'text-bison-001',
];

function sanitizeAIOutput(text) {
  if (!text) return text;
  return text.replace(/```json\n?|\n?```/g, '').trim();
}

function safeParseJSON(jsonString) {
  try {
    const sanitized = sanitizeAIOutput(jsonString);
    return JSON.parse(sanitized);
  } catch (error) {
    return {
      hiddenTriggers: ['Unable to parse stress triggers'],
      emotionalPatterns: 'Unable to complete analysis at this time.',
      burnoutRisk: 'Medium',
    };
  }
}

async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const body = {
    prompt: { text: prompt },
    temperature: 0.7,
    maxOutputTokens: 512,
  };

  let lastError;
  for (const model of MODEL_CANDIDATES) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generate?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini request failed for ${model}: ${response.status} ${text}`);
      }

      const json = await response.json();
      const outputText =
        json?.candidates?.[0]?.content?.[0]?.text ||
        json?.output?.[0]?.content?.[0]?.text ||
        json?.output?.[0]?.content ||
        json?.candidates?.[0]?.content;

      if (!outputText) {
        throw new Error(`Gemini response missing text for ${model}`);
      }

      return outputText;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Gemini request failed');
}

function deriveFallbackTriggers(text) {
  const triggers = [];
  const textLower = text.toLowerCase();

  if (textLower.includes('sleep') || textLower.includes('tired')) triggers.push('Sleep Deprivation');
  if (textLower.includes('exam') || textLower.includes('test')) triggers.push('Mock Exams');
  if (textLower.includes('math') || textLower.includes('chemistry') || textLower.includes('physics')) triggers.push('Subject Difficulty');
  if (textLower.includes('anxiety') || textLower.includes('stressed') || textLower.includes('pressure')) triggers.push('Academic Anxiety');
  if (textLower.includes('score') || textLower.includes('marks')) triggers.push('Performance Pressure');
  if (triggers.length === 0) triggers.push('General Academic Stress');
  return triggers;
}

function mapBurnoutRisk(mood) {
  const rating = Number(mood);
  if (rating <= 2) return 'High';
  if (rating <= 5) return 'Medium';
  return 'Low';
}

async function analyzeJournal(text, mood) {
  const prompt = `Analyze this open-ended journal entry and mood score (${mood}/10) from a student preparing for high-stakes competitive exams. Extract underlying stress points that a standard tracker would miss. Return strictly a raw JSON object (no markdown wrappers) with three keys: 'hiddenTriggers' (an array of specific strings like subjects, test types, or lifestyle factors), 'emotionalPatterns' (a concise 1-sentence diagnostic synthesis), and 'burnoutRisk' ('Low', 'Medium', or 'High').\n\nJournal Entry:\n${text}`;

  try {
    const resultText = await callGemini(prompt);
    const parsed = safeParseJSON(resultText);
    return {
      hiddenTriggers: parsed.hiddenTriggers || deriveFallbackTriggers(text),
      emotionalPatterns: parsed.emotionalPatterns || 'Student exhibits stress patterns worth monitoring.',
      burnoutRisk: parsed.burnoutRisk || mapBurnoutRisk(mood),
    };
  } catch (_) {
    return {
      hiddenTriggers: deriveFallbackTriggers(text),
      emotionalPatterns:
        mood <= 3
          ? 'Student exhibits signs of acute stress and burnout with potential need for immediate wellness intervention.'
          : mood <= 6
          ? 'Student shows moderate stress levels with some coping mechanisms in place.'
          : 'Student demonstrates good stress management and positive emotional resilience.',
      burnoutRisk: mapBurnoutRisk(mood),
    };
  }
}

async function createChatResponse(message, { mood = 5, hiddenTriggers = [] } = {}) {
  const prompt = `You are an empathetic, always-available digital companion for a student preparing for highly competitive exams.\n\nCURRENT STUDENT CONTEXT:\n- Last Logged Mood: ${mood}/10\n- AI-Detected Triggers: ${hiddenTriggers.length > 0 ? hiddenTriggers.join(', ') : 'No triggers logged yet'}\n\nCRITICAL DIRECTIVES:\n1. Act safely as an empathetic digital companion throughout their academic journey.\n2. Provide hyper-personalized, contextual wellness support. Do not genericize.\n3. Proactively reference their known stress triggers if relevant to help them navigate hidden anxieties.\n4. Offer real-time tailored coping strategies, adaptive mindfulness exercises, or motivational encouragement based heavily on their current states.\n5. Keep responses concise, comforting, and grounded. Do not give clinical medical diagnoses.\n\nStudent's Message:\n${message}`;

  try {
    return await callGemini(prompt);
  } catch (_) {
    const lower = message.toLowerCase();
    if (lower.includes('stress') || lower.includes('anxious')) {
      return `I hear that you're feeling stressed. That's completely normal for exam prep. Let me help you work through this. Since you mentioned ${hiddenTriggers.length > 0 ? `your struggles with ${hiddenTriggers[0]}` : 'your challenges'}, here are some immediate strategies: take a 5-minute breathing break, break your study into focused sessions, and remember that progress over perfection is the goal. You've got this! 💪`;
    }
    if (lower.includes('sleep') || lower.includes('tired')) {
      return `Sleep is crucial for cognitive performance and memory retention. Your brain needs 7-9 hours to consolidate what you've learned. Consider setting a strict bedtime, avoiding screens 1 hour before bed, and creating a consistent sleep schedule. Quality rest is productive rest!`;
    }
    if (lower.includes('motivation') || lower.includes('discouraged')) {
      return `Remember why you started this journey. Every exam topper has faced moments of doubt. The fact that you're tracking your wellness shows you care about sustainable success. You're building resilience along with knowledge. Keep going! 🌟`;
    }
    if (lower.includes('thank') || lower.includes('help')) {
      return `I'm here for you whenever you need support. Whether it's during stressful exam prep or celebrating your wins, I'm your companion. Keep taking care of yourself - your wellbeing is just as important as your scores.`;
    }
    return `That's thoughtful of you to share. ${hiddenTriggers.length > 0 ? `I noticed you're dealing with ${hiddenTriggers[0]} - that can definitely be challenging.` : 'Exam prep is a marathon, not a sprint.'} Remember to balance your study with adequate rest and exercise. How can I best support you right now?`;
  }
}

module.exports = {
  analyzeJournal,
  createChatResponse,
};
