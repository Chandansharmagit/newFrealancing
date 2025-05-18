// ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to Travel World. How can I help you today?", sender: "agent" }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { text: inputText, sender: "user" }];
    setMessages(newMessages);
    setInputText("");

    // Simulate agent response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          text: "Thank you for your message. Our team will get back to you shortly.", 
          sender: "agent" 
        }
      ]);
    }, 1000);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-box-container">
      {/* Chat button */}
      <button 
        className="chat-toggle-button"
        onClick={toggleChatBox}
      >
        {isOpen ? "×" : "Chat with us"}
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Travel World</h3>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;