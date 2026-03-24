document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ai-chat-container');
    if (!container) return;

    // Inject Styles directly into the head
    const style = document.createElement('style');
    style.textContent = `
        .chat-toggle { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #0078ff; color: white; border: none; cursor: pointer; z-index: 1000; font-size: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.3s; }
        .chat-toggle:hover { transform: scale(1.1); }
        .chat-box { position: fixed; bottom: 95px; right: 20px; width: 330px; height: 480px; background: #fff; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: none; flex-direction: column; z-index: 1000; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); font-family: 'Poppins', sans-serif; }
        .chat-box.active { display: flex; animation: fadeIn 0.3s ease; }
        .chat-header { background: #0078ff; color: white; padding: 15px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .chat-logs { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f9f9f9; }
        .msg { padding: 10px 14px; border-radius: 18px; max-width: 85%; line-height: 1.4; font-size: 14px; word-wrap: break-word; }
        .msg.user { align-self: flex-end; background: #0078ff; color: white; border-bottom-right-radius: 2px; }
        .msg.ai { align-self: flex-start; background: #e4e6eb; color: #1c1e21; border-bottom-left-radius: 2px; }
        .chat-input { display: flex; padding: 12px; background: white; border-top: 1px solid #eee; }
        .chat-input input { flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 20px; outline: none; font-size: 14px; }
        .chat-input button { margin-left: 8px; background: #0078ff; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // Build HTML Structure
    container.innerHTML = `
        <button class="chat-toggle" title="Chat with AI">🤖</button>
        <div class="chat-box">
            <div class="chat-header">
                <span>Sombik's AI Assistant</span>
                <span style="cursor:pointer" onclick="document.querySelector('.chat-box').classList.remove('active')">✕</span>
            </div>
            <div class="chat-logs" id="chatLogs">
                <div class="msg ai">Hi! I'm Sombik's virtual assistant. How can I help you today?</div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Ask me anything...">
                <button id="sendBtn">➤</button>
            </div>
        </div>
    `;

    const chatBox = container.querySelector('.chat-box');
    const toggle = container.querySelector('.chat-toggle');
    const input = document.getElementById('chatInput');
    const logs = document.getElementById('chatLogs');
    const sendBtn = document.getElementById('sendBtn');

    toggle.onclick = () => chatBox.classList.toggle('active');

    const addMessage = (text, sender) => {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        logs.appendChild(div);
        logs.scrollTop = logs.scrollHeight;
    };

    const handleSend = async () => {
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        input.value = '';

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg ai';
        typingDiv.textContent = '...';
        logs.appendChild(typingDiv);

        try {
            const response = await fetch('https://sombikroy17.sombikroy2000.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            logs.removeChild(typingDiv); // Remove typing dots
            addMessage(data.response || "I'm having trouble thinking right now.", 'ai');
        } catch (err) {
            logs.removeChild(typingDiv);
            addMessage("I couldn't connect to my brain. Please check your internet or the Worker deployment.", 'ai');
        }
    };

    sendBtn.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
});
