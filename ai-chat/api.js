// Riyasat Infra AI API & Logic
// Handles communication with the AI, limits, and system identity

// Import API Key (Handles Vite environment or fallback)
const API_KEY = import.meta.env ? import.meta.env.VITE_OPENROUTER_API_KEY : '';
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are "RIO", a highly sophisticated, premium AI Assistant built specifically for Riyasat Infra.
Your clients are high net-worth individuals and investors.

Identity Rules:
- Your name is RIO. You represent a luxury real estate brand.
- If asked "who are you", reply: "I am RIO, the premium AI assistant for Riyasat Infra."

Project Knowledge (Green Glades Estate):
- Project Name: Green Glades Estate.
- Location: Premium plots near Bhopal, Madhya Pradesh.
- Pricing: Luxury plots ranging from ₹80 Lakhs to ₹1.5 Crore+.
- Amenities: Club house, swimming pool, 24/7 security, lush green parks, and high-end infrastructure.
- Investment: High appreciation potential due to prime location.

Special External Knowledge (Bhopal & India):
- Bhopal Market: If asked about the best property prices in Bhopal or market trends, mention that areas near Green Glades (towards Kolar or Misrod extension) are seeing high appreciation.
- Bhopal Weather: You can answer general questions about Bhopal's weather if asked.
- Property Rules in India: You can answer general queries about registry rules, RERA, and property laws in India to guide the user.

Internal Links & Navigation:
- To Book a Visit/Site: /book-visit
- To See Projects: /projects or /gallery
- To Contact: /contact or 9111922665
- Investment Details: /projects
- About Us: /about
- Staff Portal: /auth/login

Language Control (CRITICAL):
- ALWAYS reply in the EXACT SAME language the user uses (English, Hindi, or Hinglish).
- IF user types in Hindi script -> Reply in Hindi.
- IF user types in English -> Reply in English.

Tone and Style (helpful & Professional):
- Be helpful and detailed. Use clear, professional language.
- Never mix Hindi and English in the same sentence unless necessary for a proper noun.
- Ensure the user feels valued and well-informed about Bhopal and Riyasat Infra.

Fallback Rules:
- If you don't know the answer, give a safe, helpful response related to real estate.
- If stuck, reply EXACTLY: "Apologies for the inconvenience. Our team will assist you shortly. You can contact us at 6269474493."`;

const LIMITS = {
  PER_SESSION: 50,
  PER_DAY: 200,
};

function getStorage() {
  const data = localStorage.getItem('riyasat_ai_usage');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function saveStorage(data) {
  localStorage.setItem('riyasat_ai_usage', JSON.stringify(data));
}

function checkAndResetLimits() {
  let usage = getStorage();
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  if (!usage) {
    usage = {
      sessionCount: 0,
      dailyCount: 0,
      lastResetTime: now,
      sessionStartTime: now
    };
  } else {
    // Reset daily if 24 hours passed
    if (now - usage.lastResetTime > ONE_DAY) {
      usage.dailyCount = 0;
      usage.lastResetTime = now;
    }
    // Simple session logic: if more than 2 hours since last message, reset session
    if (now - usage.sessionStartTime > 2 * 60 * 60 * 1000) {
      usage.sessionCount = 0;
      usage.sessionStartTime = now;
    }
  }
  saveStorage(usage);
  return usage;
}

export function canSendMessage() {
  const usage = checkAndResetLimits();
  if (usage.dailyCount >= LIMITS.PER_DAY) {
    return { allowed: false, reason: 'Daily limit reached (30/day). Please try again tomorrow.' };
  }
  if (usage.sessionCount >= LIMITS.PER_SESSION) {
    return { allowed: false, reason: 'Session limit reached (10/session). Please take a short break.' };
  }
  return { allowed: true };
}

export function incrementMessageCount() {
  const usage = checkAndResetLimits();
  usage.sessionCount++;
  usage.dailyCount++;
  usage.sessionStartTime = Date.now(); // update active session time
  saveStorage(usage);
}

export async function sendMessageToAI(history) {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please configure your environment.");
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
  ];

  try {
    const res = await fetch(OR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Riyasat Infra AI'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'API error ' + res.status);
    }
    
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Check for safety overrides just in case model ignores system prompt
    const lowerReply = reply.toLowerCase();
    if (lowerReply.includes('as an ai') && lowerReply.includes('cannot fulfill')) {
       return "Apologies for the inconvenience. Our team will assist you shortly. You can contact us at 6269474493.";
    }

    return reply;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}
