import { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'companion',
      text: '👋 Hello! I\'m your Empathetic Digital Companion. I\'m here to support you through your exam preparation journey. Share your thoughts, concerns, and let\'s navigate this together with personalized wellness strategies. What\'s on your mind today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim().length === 0 || loading) return;

    // Add user message to chat
    const userMessageId = Date.now();
    const newUserMessage = {
      id: userMessageId,
      role: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            mood: analysis?.mood,
            hiddenTriggers: analysis?.hiddenTriggers,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add companion response
      const companionMessage = {
        id: Date.now() + 1,
        role: 'companion',
        text: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, companionMessage]);
    } catch (err) {
      console.error('Chat error:', err);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'companion',
          text: '⚠️ Sorry, I encountered an error while processing your message. Please try again.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="chat-panel">
      <div className="panel-header">
        <h2>💬 Wellness Companion Chat</h2>
        <span className="status-indicator">🟢 Online</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message message-${msg.role} ${msg.isError ? 'message-error' : ''}`}
          >
            <div className="message-bubble">
              {msg.text}
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-companion">
            <div className="message-bubble">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Ask me anything about your wellness, exam prep, stress management, or just chat..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          rows="3"
        />
        <button
          className="btn-send"
          onClick={handleSendMessage}
          disabled={loading || inputMessage.trim().length === 0}
        >
          {loading ? '⏳' : '💬 Talk'}
        </button>
      </div>
    </section>
  );
}
