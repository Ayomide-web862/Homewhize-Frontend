import React, { useState } from "react";
import { FiSend, FiUser, FiArrowLeft } from "react-icons/fi";
import "./ServiceProviderMessages.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";

export default function ServiceProviderMessages() {

  // ===== Conversations =====
  const [conversations] = useState([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Are you available tomorrow?",
      time: "10:30 AM",
      unread: 3,
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Thank you!",
      time: "Yesterday",
      unread: 0,
    },
  ]);

  const [activeChat, setActiveChat] = useState(null);

  // ===== Messages =====
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello 👋", time: "10:00 AM" },
    { id: 2, sender: "provider", text: "Hi! How can I help?", time: "10:01 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "provider",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <ServiceProviderLayout>
      <div className="wa-container">

        {/* ======================
            CONVERSATION LIST
        ======================= */}
        <div className={`wa-list ${activeChat ? "hide-mobile" : ""}`}>
          <h2>Messages</h2>

          {conversations.map((c) => (
            <div
              key={c.id}
              className="wa-chat-item"
              onClick={() => setActiveChat(c)}
            >
              <div className="wa-avatar">
                <FiUser />
              </div>

              <div className="wa-info">
                <div className="wa-top">
                  <h4>{c.name}</h4>
                  <span>{c.time}</span>
                </div>

                <div className="wa-bottom">
                  <p>{c.lastMessage}</p>
                  {c.unread > 0 && (
                    <div className="wa-badge">{c.unread}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ======================
              CHAT SCREEN
        ======================= */}
        {activeChat && (
          <div className="wa-chat">

            {/* HEADER */}
            <div className="wa-chat-header">
              <FiArrowLeft
                className="back-btn"
                onClick={() => setActiveChat(null)}
              />

              <div className="wa-avatar large">
                <FiUser />
              </div>

              <h3>{activeChat.name}</h3>
            </div>

            {/* MESSAGES */}
            <div className="wa-messages">

              {/* 🔥 CENTER WATERMARK LOGO */}
              <div className="chat-watermark"></div>

              {messages.map((msg) => (
                <div key={msg.id} className={`wa-message ${msg.sender}`}>
                  <div className="bubble">
                    {msg.text}
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="wa-input">
              <input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />

              <button onClick={sendMessage}>
                <FiSend />
              </button>
            </div>

          </div>
        )}
      </div>
    </ServiceProviderLayout>
  );
}