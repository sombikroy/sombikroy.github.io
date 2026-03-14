// ── AI CHAT WIDGET ──

var SOMBIK_CONTEXT = `You are an AI assistant on Sombik Roy's personal portfolio website. Answer questions about Sombik concisely and professionally. Here is all the information about him:

NAME: Sombik Roy
ROLE: POD Plugin Developer
LOCATION: Kolkata, West Bengal, India
EMAIL: sombikroy2000@gmail.com
PHONE: +91 8583835893
GITHUB: github.com/sombikroy

EDUCATION:
- B.Tech in Electrical Engineering from IIT (ISM) Dhanbad (2019–2024)
- Qualified JEE Mains and JEE Advanced in 2019

EXPERIENCE:
1. Freelancing – POD Plugin Developer (Aug 2025 – Present, Part-Time)
   - Designed and developed custom SAP DM POD plugins to enhance Production Operator Dashboard functionality
   - Implemented UI customizations using JavaScript and integrated backend services via REST APIs
   - Extended standard SAP DM features through plugin architecture and POD Designer configurations
   - Integrated manufacturing data with backend systems ensuring real-time data visibility
   - Performed debugging, performance optimization, and deployment support in SAP BTP environment
   - Collaborated with senior consultants on solution design and manufacturing workflow mapping

2. Turing – Research Math Analyst (Oct 2024 – Dec 2024, Full-Time)
   - Worked on Apple Research Project — LLM model evaluation and development
   - Modified and contributed to developing large language models
   - Utilized Turing University to develop LLM models

3. Digital Marveled – Sales and Marketing Intern (May 2022 – Aug 2022, Internship)
   - Worked on digital marketing via various social media
   - Campaign Marketing, Brand Awareness, Social Media Management and Market Research

SKILLS:
- SAP Technologies: SAP Digital Manufacturing (SAP DM), POD Plugin Development, POD Designer, SAP BTP Integration
- Programming: JavaScript, HTML5, CSS3, PHP, Python
- Backend & APIs: REST APIs, JSON, MySQL, Database Optimization
- Tools: Git, Postman, SAP BTP, VS Code
- Core: MES, Plugin Architecture, System Integration, Performance Optimization, Debugging

PROJECTS:
1. Custom SAP DM POD Plugin – SAP DM, JavaScript, REST API, SAP BTP
2. LLM Research – Apple Project – Python, LLM, Research
3. Manufacturing System Integration – MySQL, REST API, SAP BTP, JSON

ACHIEVEMENTS:
- Qualified JEE Advanced (2019)
- Qualified JEE Mains (2019)
- B.Tech from IIT (ISM) Dhanbad (2024)
- Apple LLM Research Contributor at Turing (2024)

AVAILABILITY: Open to full-time roles and freelance SAP DM projects.

Keep answers short (2-4 sentences max). Be friendly and professional. If asked something not related to Sombik, politely redirect to his profile.`;

// Toggle chat
var chatBtn = document.getElementById('aiChatBtn');
var chatBox = document.getElementById('aiChatBox');
var chatClose = document.getElementById('aiChatClose');
var chatOpenIcon = document.getElementById('chatOpenIcon');
var chatCloseIcon = document.getElementById('chatCloseIcon');

function openChat() {
  chatBox.classList.add('open');
  chatOpenIcon.style.display = 'none';
  chatCloseIcon.style.display = 'block';
  document.getElementById('aiChatInput').focus();
}

function closeChat() {
  chatBox.classList.remove('open');
  chatOpenIcon.style.display = 'block';
  chatCloseIcon.style.display = 'none';
}

chatBtn.addEventListener('click', function () {
  if (chatBox.classList.contains('open')) {
    closeChat();
  } else {
    openChat();
  }
});

chatClose.addEventListener('click', closeChat);

// Send message
var messagesEl = document.getElementById('aiMessages');
var inputEl = document.getElementById('aiChatInput');
var sendBtn = document.getElementById('aiSendBtn');
var suggestionsEl = document.getElementById('aiSuggestions');
var conversationHistory = [];

function addMessage(text, isUser) {
  var msg = document.createElement('div');
  msg.className = 'ai-msg ' + (isUser ? 'ai-msg-user' : 'ai-msg-bot');
  var bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble';
  bubble.textContent = text;
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

function addTyping() {
  var msg = document.createElement('div');
  msg.className = 'ai-msg ai-msg-bot';
  msg.id = 'typingIndicator';
  msg.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  var t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function hideSuggestions() {
  if (suggestionsEl) suggestionsEl.style.display = 'none';
}

async function sendMessage(text) {
  if (!text.trim()) return;

  hideSuggestions();
  addMessage(text, true);
  inputEl.value = '';
  sendBtn.disabled = true;
  addTyping();

  conversationHistory.push({ role: 'user', content: text });

  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SOMBIK_CONTEXT,
        messages: conversationHistory
      })
    });

    var data = await response.json();
    var reply = data.content && data.content[0] ? data.content[0].text : "I'm having trouble connecting right now. Please reach out to Sombik directly at sombikroy2000@gmail.com!";

    removeTyping();
    addMessage(reply, false);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    removeTyping();
    addMessage("Sorry, I'm unable to connect right now. Please contact Sombik directly at sombikroy2000@gmail.com!", false);
  }

  sendBtn.disabled = false;
  inputEl.focus();
}

function sendSuggestion(text) {
  sendMessage(text);
}

sendBtn.addEventListener('click', function () {
  sendMessage(inputEl.value);
});

inputEl.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(inputEl.value);
  }
});
