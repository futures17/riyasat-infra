import './chat.css';
import { canSendMessage, incrementMessageCount, sendMessageToAI } from './api.js';

// Suggestions Data - Top Questions
const SUGGESTIONS = [
  "Book a Visit",
  "Price Details",
  "Master Layout",
  "Location & Connectivity",
  "Amenities & Facilities",
  "Investment Details",
  "About Project",
  "The Developer",
  "Full Gallery",
  "Contact Us"
];

// Local Knowledge Base for Instant Responses
const LOCAL_KNOWLEDGE = [
  { keywords: ["book", "appointment", "visit", "visit site", "site visit"], response: "You can book your site visit here: /book-visit. Our team will assist you with the scheduling.", link: "/book-visit" },
  { keywords: ["contact", "call", "phone", "email", "support"], response: "You can reach our team at **9111922665** or visit our contact page: /contact", link: "/contact" },
  { keywords: ["price", "cost", "budget", "pricing"], response: "Our luxury plots range from **₹80 Lakhs to ₹1.5 Crore+**. For detailed pricing, visit: /projects", link: "/projects" },
  { keywords: ["layout", "map", "master", "plan"], response: "You can view the project's master layout and architectural plan here: /projects", link: "/projects" },
  { keywords: ["amenities", "facilities", "club", "pool", "gym", "lifestyle"], response: "Green Glades offers resort-level amenities like an infinity pool, club house, and landscaped courts. Details: /projects", link: "/projects" },
  { keywords: ["location", "address", "connectivity", "where is it", "how to reach"], response: "Green Glades Estate is located in a prime area near Bhopal with excellent connectivity. View on map: /projects", link: "/projects" },
  { keywords: ["gallery", "photos", "images", "videos"], response: "Explore the beauty of Green Glades in our full gallery: /gallery", link: "/gallery" },
  { keywords: ["developer", "riyasat", "infra", "who build", "about riyasat"], response: "Riyasat Infra is the premium developer behind Green Glades, dedicated to building the next century using materials of the past. Learn more: /developer", link: "/developer" },
  { keywords: ["investment", "appreciation", "returns", "acquisition"], response: "Green Glades is a high-yield investment opportunity with curated acquisition details. Details: /projects", link: "/projects" },
  { keywords: ["about", "project", "details", "estate", "green glades"], response: "Green Glades is a premium luxury estate project by Riyasat Infra. Read more: /about", link: "/about" },
  { keywords: ["join", "team", "career", "job"], response: "We are always looking for talent! Please contact our HR via the contact page: /contact", link: "/contact" },
  { keywords: ["staff", "portal", "login", "admin"], response: "Staff and members can access their portal here: /auth/login", link: "/auth/login" },
  { keywords: ["home", "start", "main"], response: "Return to the main page to explore our vision: /", link: "/" }
];

// UI Templates
const WIDGET_HTML = `
  <!-- Floating Icon (Video) -->
  <button id="riyasat-ai-btn" class="riyasat-chat-btn" aria-label="Open AI Assistant">
    <video src="/src/assets/video/icon.mp4" autoplay loop muted playsinline></video>
  </button>

  <!-- Scroll Popup -->
  <div id="riyasat-ai-popup" class="riyasat-ai-popup">
    <button id="riyasat-popup-close" class="popup-close-btn" aria-label="Close">&times;</button>
    <div class="popup-avatar-container">
      <video src="/src/assets/video/manager_avatar.webm" autoplay loop muted playsinline class="popup-avatar"></video>
    </div>
    <div class="popup-content">
      <h4 class="popup-title">RIO</h4>
      <p class="popup-text">Hi, I can assist you with properties and bookings.</p>
      <button id="riyasat-popup-chat" class="popup-chat-btn">Chat with AI</button>
    </div>
  </div>

  <!-- Full Chatbox Modal -->
  <div id="riyasat-ai-modal" class="riyasat-chat-modal">
    <div class="riyasat-chat-header">
      <img src="/src/assets/corelogo.webp" alt="Riyasat Infra" class="riyasat-header-logo" />
      <div class="riyasat-chat-title-wrapper">
        <h3 class="riyasat-chat-title">RIO</h3>
        <p class="riyasat-chat-subtitle"><span class="online-dot"></span> Online & Ready</p>
      </div>
      <button id="riyasat-ai-close" class="riyasat-chat-close" aria-label="Close">&times;</button>
    </div>
    
    <div id="riyasat-ai-messages" class="riyasat-chat-messages">
      <div class="riyasat-msg-wrapper ai">
        <div class="ai-avatar-wrapper">
          <video src="/src/assets/video/insite_chatbox_avatar.webm" autoplay loop muted playsinline></video>
        </div>
        <div class="msg-content">
          <div class="riyasat-msg-bubble">
            Hello! I am RIO, Riyasat Infra's premium AI assistant. How can I guide you today?
          </div>
          <div class="riyasat-msg-time">Now</div>
        </div>
      </div>
    </div>
    
    <div id="riyasat-ai-chips" class="riyasat-chat-chips">
      ${SUGGESTIONS.map(s => `<div class="riyasat-chip">${s}</div>`).join('')}
    </div>
    
    <div class="riyasat-chat-input-area">
      <div class="riyasat-chat-input-wrapper">
        <textarea id="riyasat-ai-input" class="riyasat-chat-input" rows="1" placeholder="Ask anything..."></textarea>
      </div>
      <button id="riyasat-ai-send" class="riyasat-chat-send" aria-label="Send Message" disabled>
        <svg viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
    <div class="riyasat-chat-footer">Powered by Hexatom Team</div>
  </div>
`;

// State
let isChatOpen = false;
let isGenerating = false;
let conversationHistory = [];

export function initRiyasatAI() {
  // Disable AI for admin, auth, and member portal pages
  if (
    window.location.pathname.startsWith('/admin') ||
    window.location.pathname.startsWith('/auth') ||
    window.location.pathname.startsWith('/member')
  ) return;

  if (document.getElementById('riyasat-ai-btn')) return;

  const container = document.createElement('div');
  container.innerHTML = WIDGET_HTML;
  document.body.appendChild(container);

  // Hide button during initial loading to clear preloader
  const btn = document.getElementById('riyasat-ai-btn');
  if (btn) btn.classList.add('initially-hidden');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (btn) btn.classList.remove('initially-hidden');
    }, 2500); // 2.5 second delay after load
  });

  bindEvents();
}

function bindEvents() {
  const btn = document.getElementById('riyasat-ai-btn');
  const modal = document.getElementById('riyasat-ai-modal');
  const closeBtn = document.getElementById('riyasat-ai-close');
  const input = document.getElementById('riyasat-ai-input');
  const sendBtn = document.getElementById('riyasat-ai-send');
  const chips = document.querySelectorAll('.riyasat-chip');
  
  const popup = document.getElementById('riyasat-ai-popup');
  const popupClose = document.getElementById('riyasat-popup-close');
  const popupChatBtn = document.getElementById('riyasat-popup-chat');

  let popupShown = false;
  let popupDismissed = false;

  window.addEventListener('scroll', () => {
    if (popupDismissed || isChatOpen) return;
    
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const isMobile = window.innerWidth <= 768;
    
    let shouldShowPopup = false;
    if (isMobile) {
      // Mobile: 30% to 70%
      shouldShowPopup = scrollPercent >= 30 && scrollPercent <= 70;
    } else {
      // PC: 45% to 80%
      shouldShowPopup = scrollPercent >= 45 && scrollPercent <= 80;
    }
    
    if (shouldShowPopup) {
      if (!popup.classList.contains('active')) {
        popup.classList.add('active');
        btn.classList.add('hidden');
      }
    } else {
      if (popup.classList.contains('active')) {
        popup.classList.remove('active');
        btn.classList.remove('hidden');
      }
    }
  });


  popupClose.addEventListener('click', () => {
    popup.classList.remove('active');
    popupDismissed = true;
    btn.classList.remove('hidden');
  });

  popupChatBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    popupDismissed = true;
    toggleChat(true);
  });

  btn.addEventListener('click', () => toggleChat(true));
  closeBtn.addEventListener('click', () => toggleChat(false));

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    sendBtn.disabled = input.value.trim().length === 0 || isGenerating;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) handleSend();
    }
  });

  sendBtn.addEventListener('click', () => {
    if (!sendBtn.disabled) handleSend();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent;
      input.dispatchEvent(new Event('input'));
      handleSend();
      document.getElementById('riyasat-ai-chips').style.display = 'none'; // hide chips after first use
    });
  });
}

function toggleChat(state) {
  isChatOpen = state;
  const modal = document.getElementById('riyasat-ai-modal');
  const btn = document.getElementById('riyasat-ai-btn');
  const popup = document.getElementById('riyasat-ai-popup');

  if (state) {
    modal.classList.add('active');
    btn.classList.add('hidden');
    popup.classList.remove('active');
    setTimeout(() => document.getElementById('riyasat-ai-input').focus(), 300);
  } else {
    modal.classList.remove('active');
    btn.classList.remove('hidden');
  }
}

function addMessage(text, sender) {
  const msgs = document.getElementById('riyasat-ai-messages');
  const wrapper = document.createElement('div');
  wrapper.className = `riyasat-msg-wrapper ${sender}`;
  
  // Basic markdown formatting
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  // Detect internal links (starting with /) and convert to buttons
  // Improved regex: must start with / but NOT be part of a closing HTML tag like </strong>
  // We look for / followed by alphanumeric characters, ensuring it's not preceded by <
  const linkMatch = formatted.match(/(?<!<)\/([a-zA-Z0-9\-_]+)/);
  let ctaHtml = '';
  if (linkMatch && sender === 'ai') {
    const path = linkMatch[0];
    const reservedTags = ['strong', 'br', 'div', 'span', 'p', 'b', 'i'];
    const pathName = path.replace('/', '');
    
    if (!reservedTags.includes(pathName) && pathName.length > 2) {
      const label = pathName.replace(/-/g, ' ').toUpperCase();
      ctaHtml = `
        <div class="riyasat-msg-cta">
          <a href="${path}" class="msg-cta-btn">
            VIEW ${label}
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.17 11l-5.3-5.3 1.42-1.42L20 12l-7.71 7.71-1.42-1.42 5.3-5.3H4v-2z"/></svg>
          </a>
        </div>
      `;
      
      // Remove the path and any surrounding markdown brackets/parentheses
      // Matches things like [Label](/path) or (/path) or just /path
      const markdownRegex = new RegExp(`\\[.*?\\]\\(.*?${path}.*?\\)|\\(.*?${path}.*?\\)|${path}`, 'g');
      formatted = formatted.replace(markdownRegex, '');
    }
  }

  if (sender === 'ai') {
    wrapper.innerHTML = `
      <div class="ai-avatar-wrapper">
        <video src="/src/assets/video/insite_chatbox_avatar.webm" autoplay loop muted playsinline></video>
      </div>
      <div class="msg-content">
        <div class="riyasat-msg-bubble">
          ${formatted}
          ${ctaHtml}
        </div>
        <div class="riyasat-msg-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="msg-content">
        <div class="riyasat-msg-bubble">${formatted}</div>
        <div class="riyasat-msg-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
    `;
  }
  msgs.appendChild(wrapper);
  msgs.scrollTop = msgs.scrollHeight;
}

function addTyping() {
  const msgs = document.getElementById('riyasat-ai-messages');
  const wrapper = document.createElement('div');
  wrapper.id = 'riyasat-ai-typing';
  wrapper.className = `riyasat-msg-wrapper ai`;
  wrapper.innerHTML = `
    <div class="ai-avatar-wrapper">
      <video src="/src/assets/video/insite_chatbox_avatar.webm" autoplay loop muted playsinline></video>
    </div>
    <div class="msg-content">
      <div class="riyasat-msg-bubble riyasat-typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  msgs.appendChild(wrapper);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('riyasat-ai-typing');
  if (el) el.remove();
}

async function handleSend() {
  const input = document.getElementById('riyasat-ai-input');
  const sendBtn = document.getElementById('riyasat-ai-send');
  const text = input.value.trim();
  
  if (!text || isGenerating) return;

  const limitCheck = canSendMessage();
  if (!limitCheck.allowed) {
    addMessage("⚠️ " + limitCheck.reason, 'ai');
    return;
  }

  // Add User Message
  addMessage(text, 'user');
  conversationHistory.push({ role: 'user', content: text });
  
  // Cleanup Input
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;
  isGenerating = true;

  // Track Usage
  incrementMessageCount();

  // Hide chips
  document.getElementById('riyasat-ai-chips').style.display = 'none';

  // --- Local Knowledge Logic ---
  const lowerText = text.toLowerCase();
  
  // Skip local knowledge if it's an external query (weather, temp, news, general info, etc.)
  const externalKeywords = ["weather", "temperature", "temp", "mausam", "barish", "rain", "news", "today", "tomorrow", "how", "what", "who", "why", "kese", "kab", "kaun", "kya", "chance"];
  const isExternalQuery = externalKeywords.some(k => lowerText.includes(k));

  let localMatch = null;
  if (!isExternalQuery) {
    // Find the best match (first one that hits)
    for (const item of LOCAL_KNOWLEDGE) {
      if (item.keywords.some(k => lowerText.includes(k))) {
        localMatch = item;
        break;
      }
    }
  }

  if (localMatch) {
    // Show typing briefly for realism, then local response
    addTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(localMatch.response, 'ai');
      conversationHistory.push({ role: 'assistant', content: localMatch.response });
      isGenerating = false;
      sendBtn.disabled = input.value.trim().length === 0;
    }, 600);
    return;
  }
  // --- End Local Logic ---

  // Show Typing indicator for API
  addTyping();

  try {
    const aiReply = await sendMessageToAI(conversationHistory);
    removeTyping();
    addMessage(aiReply, 'ai');
    conversationHistory.push({ role: 'assistant', content: aiReply });
    
    // Keep history manageable
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }
  } catch (err) {
    removeTyping();
    addMessage("❌ Apologies for the inconvenience. Our team will assist you shortly. You can contact us at 6269474493.", 'ai');
  } finally {
    isGenerating = false;
    sendBtn.disabled = input.value.trim().length === 0;
  }
}

// Auto-initialize when imported
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRiyasatAI);
} else {
  initRiyasatAI();
}
