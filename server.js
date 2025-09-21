const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store (for demo purposes)
let messages = [
  { id: 1, text: 'Welcome to the Simple Node.js App!', timestamp: new Date().toISOString() },
  { id: 2, text: 'This app is ready for OpenShift deployment.', timestamp: new Date().toISOString() }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Application is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const newMessage = {
    id: messages.length + 1,
    text: text,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const messageIndex = messages.findIndex(msg => msg.id === id);
  
  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages.splice(messageIndex, 1);
  res.json({ message: 'Message deleted successfully' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});