// AI CHAT WIDGET
// Note: email built at runtime - never written as plain text

var CTX = 'You are an AI assistant on Sombik Roy portfolio website.\n'
  + 'NAME: Sombik Roy\n'
  + 'ROLE: POD Plugin Developer\n'
  + 'LOCATION: Kolkata, West Bengal, India\n'
  + 'EMAIL: sombikroy2000' + String.fromCharCode(64) + 'gmail.com\n'
  + 'PHONE: +91 8583835893\n'
  + 'GITHUB: github.com/sombikroy\n\n'
  + 'EDUCATION: B.Tech Electrical Engineering, IIT (ISM) Dhanbad 2019-2024. Qualified JEE Mains and Advanced 2019.\n\n'
  + 'EXPERIENCE:\n'
  + '1. Freelancing - POD Plugin Developer (Aug 2025-Present, Part-Time): Designed custom SAP DM POD plugins, UI customizations with JavaScript, REST API integrations, SAP BTP deployment, performance optimization, collaborated with senior consultants.\n'
  + '2. Turing - Research Math Analyst (Oct-Dec 2024, Full-Time): Apple Research Project, LLM model evaluation and development.\n'
  + '3. Digital Marveled - Sales Marketing Intern (May-Aug 2022): Digital marketing, social media management.\n\n'
  + 'SKILLS: SAP DM, POD Plugin Development, POD Designer, SAP BTP, JavaScript, HTML5, CSS3, PHP, Python, REST APIs, MySQL, Git, Postman.\n\n'
  + 'ACHIEVEMENTS: JEE Advanced 2019, JEE Mains 2019, IIT ISM Graduate 2024, Apple LLM Research Contributor 2024.\n\n'
  + 'Keep answers to 2-4 sentences. Be friendly and professional.';

var chatBtn    = document.getElementById('aiChatBtn');
var chatBox    = document.getElementById('aiChatBox');
var chatClose  = document.getElementById('aiChatClose');
var openIcon   = document.getElementById('chatOpenIcon');
var closeIcon  = document.getElementById('chatCloseIcon');
var messagesEl = document.getElementById('aiMessages');
var inputEl    = document.getElementById('aiChatInput');
var sendBtn    = document.getElementById('aiSendBtn');
var suggestEl  = document.getElementById('aiSuggestions');
var history    = [];

function openChat() {
  chatBox.classList.add('open');
  openIcon.style.display = 'none';
  closeIcon.style.display = 'block';
  if (inputEl) inputEl.focus();
}

function closeChat() {
  chatBox.classList.remove('open');
  openIcon.style.display = 'block';
  closeIcon.style.display = 'none';
}

if (chatBtn) chatBtn.addEventListener('click', function () {
  chatBox.classList.contains('open') ? closeChat() : openChat();
});
if (chatClose) chatClose.addEventListener('click', closeChat);

function addMsg(text, isUser) {
  var d = document.createElement('div');
  d.className = 'ai-msg ' + (isUser ? 'ai-msg-user' : 'ai-msg-bot');
  var b = document.createElement('div');
  b.className = 'ai-msg-bubble';
  b.textContent = text;
  d.appendChild(b);
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
  var d = document.createElement('div');
  d.className = 'ai-msg ai-msg-bot';
  d.id = 'typing';
  d.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  var t = document.getElementById('typing');
  if (t) t.remove();
}

async function send(text) {
  if (!text || !text.trim()) return;
  if (suggestEl) suggestEl.style.display = 'none';
  addMsg(text, true);
  if (inputEl) inputEl.value = '';
  if (sendBtn) sendBtn.disabled = true;
  showTyping();
  history.push({ role: 'user', content: text });

  try {
    var res = await fetch('https://sombikroy17.sombikroy2000.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: CTX,
        messages: history
      })
    });
    var data = await res.json();
    hideTyping();
    var reply = data.error
      ? 'Error: ' + (data.error.message || JSON.stringify(data.error))
      : (data.content && data.content[0] ? data.content[0].text : 'Unexpected: ' + JSON.stringify(data).slice(0,100));
    addMsg(reply, false);
    history.push({ role: 'assistant', content: reply });
  } catch (err) {
    hideTyping();
    addMsg('Connection error: ' + err.message, false);
  }

  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) inputEl.focus();
}

function sendSuggestion(t) { send(t); }

if (sendBtn) sendBtn.addEventListener('click', function () { send(inputEl.value); });
if (inputEl) inputEl.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(inputEl.value); }
});
