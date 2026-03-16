// AI CHAT WIDGET

// Build context without email in plain text so Cloudflare cannot mangle it
var emailAddr = 'sombikroy2000' + '@' + 'gmail.com';

var SOMBIK_CONTEXT = 'You are an AI assistant on Sombik Roy portfolio website. Answer questions about Sombik concisely and professionally.\n\n'
  + 'NAME: Sombik Roy\n'
  + 'ROLE: POD Plugin Developer\n'
  + 'LOCATION: Kolkata, West Bengal, India\n'
  + 'EMAIL: ' + emailAddr + '\n'
  + 'PHONE: +91 8583835893\n'
  + 'GITHUB: github.com/sombikroy\n\n'
  + 'EDUCATION:\n'
  + '- B.Tech Electrical Engineering, IIT (ISM) Dhanbad (2019-2024)\n'
  + '- Qualified JEE Mains and JEE Advanced in 2019\n\n'
  + 'EXPERIENCE:\n'
  + '1. Freelancing - POD Plugin Developer (Aug 2025 - Present, Part-Time)\n'
  + '   - Designed and developed custom SAP DM POD plugins\n'
  + '   - Implemented UI customizations using JavaScript and REST APIs\n'
  + '   - Extended SAP DM features through plugin architecture and POD Designer\n'
  + '   - Integrated manufacturing data with backend systems for real-time visibility\n'
  + '   - Debugging, performance optimization, SAP BTP deployment support\n'
  + '   - Collaborated with senior consultants on manufacturing workflow mapping\n'
  + '2. Turing - Research Math Analyst (Oct 2024 - Dec 2024, Full-Time)\n'
  + '   - Apple Research Project: LLM model evaluation and development\n'
  + '   - Modified and contributed to developing large language models\n'
  + '3. Digital Marveled - Sales and Marketing Intern (May 2022 - Aug 2022)\n'
  + '   - Digital marketing, brand awareness, social media management\n\n'
  + 'SKILLS: SAP DM, POD Plugin Development, POD Designer, SAP BTP, JavaScript, HTML5, CSS3, PHP, Python, REST APIs, MySQL, Git\n\n'
  + 'PROJECTS: SAP DM POD Plugin, LLM Research (Apple/Turing), Manufacturing System Integration\n\n'
  + 'ACHIEVEMENTS: JEE Advanced (2019), JEE Mains (2019), IIT ISM Graduate (2024), Apple LLM Research Contributor (2024)\n\n'
  + 'Keep answers short (2-4 sentences). Be friendly and professional.';

// Chat toggle
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

if (chatBtn) {
  chatBtn.addEventListener('click', function () {
    chatBox.classList.contains('open') ? closeChat() : openChat();
  });
}

if (chatClose) {
  chatClose.addEventListener('click', closeChat);
}

// Messaging
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
  if (!text || !text.trim()) return;

  hideSuggestions();
  addMessage(text, true);
  inputEl.value = '';
  sendBtn.disabled = true;
  addTyping();

  conversationHistory.push({ role: 'user', content: text });

  try {
    var response = await fetch('https://sombikroy17.sombikroy2000.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SOMBIK_CONTEXT,
        messages: conversationHistory
      })
    });

    var data = await response.json();
    var reply;

    if (data.error) {
      reply = 'Error: ' + (data.error.message || JSON.stringify(data.error));
    } else if (data.content && data.content[0]) {
      reply = data.content[0].text;
    } else {
      reply = 'Unexpected response: ' + JSON.stringify(data).slice(0, 120);
    }

    removeTyping();
    addMessage(reply, false);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    removeTyping();
    addMessage('Connection error: ' + err.message, false);
  }

  sendBtn.disabled = false;
  if (inputEl) inputEl.focus();
}

function sendSuggestion(text) {
  sendMessage(text);
}

if (sendBtn) {
  sendBtn.addEventListener('click', function () {
    sendMessage(inputEl.value);
  });
}

if (inputEl) {
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });
}
