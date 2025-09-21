class SimpleApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMessages();
    }

    bindEvents() {
        document.getElementById('healthBtn').addEventListener('click', () => this.checkHealth());
        document.getElementById('addBtn').addEventListener('click', () => this.addMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addMessage();
            }
        });
    }

    async checkHealth() {
        const statusDiv = document.getElementById('healthStatus');
        statusDiv.innerHTML = 'Checking...';
        statusDiv.className = 'status-display';

        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            if (response.ok) {
                statusDiv.innerHTML = `
                    ✅ ${data.message}<br>
                    <small>Environment: ${data.environment} | ${new Date(data.timestamp).toLocaleString()}</small>
                `;
                statusDiv.classList.add('success');
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            statusDiv.innerHTML = `❌ Health check failed: ${error.message}`;
            statusDiv.classList.add('error');
        }
    }

    async loadMessages() {
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '<div class="loading">Loading messages...</div>';

        try {
            const response = await fetch('/api/messages');
            const messages = await response.json();
            
            this.renderMessages(messages);
        } catch (error) {
            messagesList.innerHTML = `<div class="loading">Error loading messages: ${error.message}</div>`;
        }
    }

    renderMessages(messages) {
        const messagesList = document.getElementById('messagesList');
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="loading">No messages yet. Add one above!</div>';
            return;
        }

        messagesList.innerHTML = messages.map(message => `
            <div class="message-item" data-id="${message.id}">
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(message.text)}</div>
                    <div class="message-timestamp">${new Date(message.timestamp).toLocaleString()}</div>
                </div>
                <div class="message-actions">
                    <button class="btn btn-danger" onclick="app.deleteMessage(${message.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async addMessage() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();

        if (!text) {
            alert('Please enter a message');
            return;
        }

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                input.value = '';
                this.loadMessages();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert(`Error adding message: ${error.message}`);
        }
    }

    async deleteMessage(id) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.loadMessages();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert(`Error deleting message: ${error.message}`);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const app = new SimpleApp();