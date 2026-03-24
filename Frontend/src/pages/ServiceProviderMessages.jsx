import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiUser, FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ServiceProviderMessages.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";
import { getProviderChats, getUserChats, getMessages, sendMessage } from "../api/messages.api";

export default function ServiceProviderMessages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isProviderMode = location.pathname.startsWith("/service-provider");
  const routeBase = isProviderMode ? "/service-provider/messages" : "/provider/messages";

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef();

  /* ================= LOAD CONVERSATIONS ================= */
  const loadConversations = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const chats = isProviderMode ? await getProviderChats() : await getUserChats();
      setConversations(chats.conversations || []);
    } catch (err) {
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [isProviderMode]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = async (id) => {
    try {
      const res = await getMessages(id);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
      navigate(`${routeBase}/${activeChat.id}`, { replace: true });
    }
  }, [activeChat]);

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!activeChat) return;

    const interval = setInterval(() => {
      loadMessages(activeChat.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChat]);

  /* ================= AUTO SELECT ================= */
  useEffect(() => {
    if (!loading && conversations.length > 0) {
      const id = conversationId ? parseInt(conversationId) : null;
      const selected = id ? conversations.find(c => c.id === id) : null;

      if (selected) setActiveChat(selected);
      else if (!activeChat) setActiveChat(conversations[0]);
    }
  }, [conversationId, conversations, loading]);

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const tempMsg = {
      id: Date.now(),
      text: newMessage,
      sender_role: isProviderMode ? "provider" : "user",
      created_at: new Date().toISOString(),
      read_flag: 0
    };

    // ✅ Show instantly (optimistic UI)
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    try {
      setSending(true);
      const res = await sendMessage(activeChat.id, newMessage.trim());

      // Replace temp message with real one
      setMessages(prev =>
        prev.map(m => (m.id === tempMsg.id ? res.message : m))
      );

      await loadConversations();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ================= DATE GROUPING ================= */
  const formatDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
  };

  const groupedMessages = [];
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString();

    if (msgDate !== lastDate) {
      groupedMessages.push({
        type: "date",
        label: formatDateLabel(msg.created_at)
      });
      lastDate = msgDate;
    }

    groupedMessages.push({ type: "message", data: msg });
  });

  if (loading) {
    return (
      <ServiceProviderLayout>
        <div className="messages-loading">Loading...</div>
      </ServiceProviderLayout>
    );
  }

  return (
    <ServiceProviderLayout>
      <div className="wa-container">

        {/* ================= LIST ================= */}
        <div className={`wa-list ${activeChat ? "hide-mobile" : ""}`}>
          <h2>Messages</h2>

          {conversations.map(c => {
            const name = isProviderMode
              ? c.user_name || "Customer"
              : c.provider_name || "Provider";

            return (
              <div
                key={c.id}
                className={`wa-chat-item ${activeChat?.id === c.id ? "active" : ""}`}
                onClick={() => setActiveChat(c)}
              >
                <div className="wa-avatar"><FiUser /></div>

                <div className="wa-info">
                  <div className="wa-top">
                    <h4>{name}</h4>
                    <span>
                      {c.last_updated && new Date(c.last_updated).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="wa-bottom">
                    <p>{c.last_message || "No messages yet"}</p>
                    {c.unread_count > 0 && (
                      <div className="wa-badge">{c.unread_count}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= CHAT ================= */}
        {activeChat && (
          <div className="wa-chat">

            {/* HEADER */}
            <div className="wa-chat-header">
              <FiArrowLeft onClick={() => setActiveChat(null)} />

              <div className="wa-avatar large"><FiUser /></div>

              <div>
                <h3>
                  {isProviderMode
                    ? activeChat.user_name
                    : activeChat.provider_name}
                </h3>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="wa-messages">
              {groupedMessages.map((item, index) => {
                if (item.type === "date") {
                  return (
                    <div key={index} className="date-divider">
                      {item.label}
                    </div>
                  );
                }

                const msg = item.data;
                const isOwn = isProviderMode
                  ? msg.sender_role === "provider"
                  : msg.sender_role === "user";

                return (
                  <div key={msg.id || index} className={`wa-message ${isOwn ? "sent" : "received"}`}>
                    <div className="bubble">
                      {msg.text}

                      <div className="meta">
                        <span className="time">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>

                        {isOwn && (
                          <span className="status">
                            {msg.read_flag ? "Seen" : "Sent"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="wa-input">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>
                <FiSend />
              </button>
            </div>

          </div>
        )}
      </div>
    </ServiceProviderLayout>
  );
}