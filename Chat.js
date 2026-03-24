document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ai-chat-container');
    if (!container) return;

    const style = document.createElement('style');
    style.textContent = `
        .chat-toggle { position: fixed; bottom: 25px; right: 25px; width: 65px; height: 65px; border-radius: 50%; background: #00f2fe; color: #000; border: none; cursor: pointer; z-index: 2000; font-size: 30px; box-shadow: 0 0 20px rgba(0, 242, 254, 0.4); }
        .chat-box { position: fixed; bottom: 100px; right: 25px; width: 350px; height: 500px; background: #1a1a1a; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: none; flex-direction: column; z-index: 2000; border: 1px solid #333; font-family: 'Poppins', sans-serif; }
        .chat-box.active { display: flex; }
        .chat-header { background: #333; color: #00f2fe; padding: 15px; font-weight: bold; border-bottom: 1px solid #444; }
        .chat-logs { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #121212; }
        .msg { padding: 10px 14px; border-radius: 15px; max-width: 80%; font-size: 14px; }
        .msg.user { align-self: flex-end; background: #00f2fe; color: #000; }
        .msg.ai { align-self: flex-start; background: #2a2a2a; color: #fff; }
        .chat-input { display: flex; padding: 15px; background: #1a1a1a; border-top: 1px solid #333; }
        .chat-input input { flex: 1; background: #2a2a2a; border: none; padding: 10px; border-radius: 5px; color: #fff; outline: none; }
        .chat-input button { margin-left: 10px; background: #00f2fe; border: none; padding: 0 15px; border-radius: 5px; cursor: pointer; color: #000; font-weight: bold; }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
        <button class="chat-toggle">🤖</button>
        <div class="chat-box">
            <div class="chat-header">AI Assistant</div>
            <div class="chat-logs" id="chatLogs"></div>
            <div class="chat-input">
                <input type="text" id="aiInput" placeholder="Ask about Sombik's skills...">
                <button id="aiSend">Send</button>
            </div>
        </div>
    `;

    const box = container.querySelector('.chat-box');
    const logs = document.getElementById('chatLogs');
    const input = document.getElementById('aiInput');

    container.querySelector('.chat-toggle').onclick = () => box.classList.toggle('active');

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        const uMsg = document.createElement('div');
        uMsg.className = 'msg user';
        uMsg.textContent = text;
        logs.appendChild(uMsg);
        input.value = '';

        try {
            const res = await fetch('https://sombikroy17.sombikroy2000.workers.dev/', {
                method: 'POST',
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            const aMsg = document.createElement('div');
            aMsg.className = 'msg ai';
            aMsg.textContent = data.response;
            logs.appendChild(aMsg);
        } catch {
            const eMsg = document.createElement('div');
            eMsg.className = 'msg ai';
            eMsg.textContent = "I'm having trouble connecting right now.";
            logs.appendChild(eMsg);
        }
        logs.scrollTop = logs.scrollHeight;
    };

    document.getElementById('aiSend').onclick = sendMessage;
    input.onkeydown = (e) => e.key === 'Enter' && sendMessage();
});
