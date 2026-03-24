import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FiClock,
  FiTag,
  FiMessageCircle,
  FiStar,
  FiMapPin,
  FiSend,
  FiX
} from "react-icons/fi";

import "./ProviderDetail.css";
import { getProviderBySlug } from "../api/providers.api";
import { startConversation, sendMessage, getMessages } from "../api/messages.api";

export default function ProviderDetail() {
  const { slug } = useParams();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef();

  useEffect(() => {
    if (!conversation || !chatOpen) return;

    const interval = setInterval(async () => {
      try {
        const msgs = await getMessages(conversation.id);
        setMessages(msgs.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        // Don't spam errors, but continue polling
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [conversation, chatOpen]);

  useEffect(() => {
    async function loadProvider() {
      const p = await getProviderBySlug(slug);
      setProvider(p);
      setServices(p.services || []);
    }
    loadProvider();
  }, [slug]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChat = async () => {
    // Validate provider and state
    if (!provider) {
      console.error('[CHAT] Provider not loaded');
      alert("Provider information is not loaded yet. Please wait.");
      return;
    }

    if (!provider.id) {
      console.error('[CHAT] Provider ID is missing:', provider);
      alert("Unable to start chat: Provider ID is missing.");
      return;
    }

    if (isStartingChat) {
      console.warn('[CHAT] Chat already starting');
      return;
    }

    try {
      console.log('[CHAT] Starting conversation with provider ID:', provider.id);
      setIsStartingChat(true);

      // Call backend to start/get conversation
      const res = await startConversation(provider.id);

      // Validate response structure
      if (!res) {
        throw new Error('Empty response from server');
      }

      if (!res.conversation) {
        console.error('[CHAT] No conversation in response:', res);
        throw new Error('No conversation created');
      }

      if (!res.conversation.id) {
        console.error('[CHAT] Conversation ID missing:', res.conversation);
        throw new Error('Conversation ID is missing');
      }

      console.log('[CHAT] Conversation created:', res.conversation.id);
      setConversation(res.conversation);

      // Fetch initial messages
      try {
        const msgsRes = await getMessages(res.conversation.id);
        if (msgsRes && Array.isArray(msgsRes.messages)) {
          setMessages(msgsRes.messages);
        } else {
          console.warn('[CHAT] Invalid messages response:', msgsRes);
          setMessages([]);
        }
      } catch (msgErr) {
        console.error('[CHAT] Error fetching messages:', msgErr);
        // Don't fail - just open chat with empty messages
        setMessages([]);
      }

      setChatOpen(true);
      console.log('[CHAT] Chat UI opened successfully');

    } catch (err) {
      console.error('[CHAT] Failed to start conversation:', {
        provider_id: provider?.id,
        error_message: err?.message,
        error_status: err?.response?.status,
        error_data: err?.response?.data
      });

      // Show user-friendly error message
      const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error occurred';
      alert(`Unable to start chat: ${errorMsg}`);

    } finally {
      setIsStartingChat(false);
    }
  };

  const handleSend = async () => {
    // Validate inputs
    if (!text.trim()) {
      console.warn('[CHAT] Empty message text');
      return;
    }

    if (!conversation) {
      console.error('[CHAT] No active conversation');
      alert("Chat session ended. Please start a new chat.");
      setChatOpen(false);
      return;
    }

    if (!conversation.id) {
      console.error('[CHAT] Conversation ID missing:', conversation);
      alert("Chat session is invalid. Please start over.");
      setChatOpen(false);
      return;
    }

    if (isSending) {
      console.warn('[CHAT] Message already sending');
      return;
    }

    try {
      console.log('[CHAT] Sending message to conversation:', conversation.id);
      setIsSending(true);

      const res = await sendMessage(conversation.id, text);

      // Validate response
      if (!res || !res.message) {
        throw new Error('Invalid response from server');
      }

      // Add message to UI
      setMessages((prev) => [...prev, res.message]);
      setText("");
      console.log('[CHAT] Message sent successfully');

    } catch (err) {
      console.error('[CHAT] Failed to send message:', {
        conversation_id: conversation?.id,
        message_length: text?.length,
        error_message: err?.message,
        error_status: err?.response?.status,
        error_data: err?.response?.data
      });

      const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error';
      alert(`Failed to send message: ${errorMsg}`);

    } finally {
      setIsSending(false);
    }
  };

  if (!provider) return <div className="provider-loading">Loading...</div>;

  return (
    <div className="provider-details-page">
      <Navbar />

      {/* HEADER */}
      <div className="provider-header">
        <div className="provider-info">
          <div className="provider-avatar">
            {provider.company_name?.charAt(0)}
          </div>

          <div>
            <h1>{provider.company_name}</h1>
            <p className="provider-description">{provider.description}</p>

            <div className="provider-meta">
              <span><FiStar /> 4.9</span>
              <span><FiMapPin /> Lagos</span>
              <span>{services.length} Services</span>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="provider-services-section">
        <h2>Available Services</h2>

        <div className="provider-services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-image">
                {service.images?.length ? (
                  <img src={service.images[0]} alt={service.title} />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>

              <div className="service-content">
                <h3>{service.title}</h3>

                <span className="service-category">
                  <FiTag /> {service.category}
                </span>

                <p className="service-description">
                  {service.description || "Professional service"}
                </p>

                <div className="service-meta">
                  <span className="price">₦{service.price}</span>
                  <span className="duration">
                    <FiClock /> {service.estimatedDuration}
                  </span>
                </div>

                <button className="chat-btn" onClick={handleChat} disabled={isStartingChat}>
                  <FiMessageCircle /> {isStartingChat ? "Starting chat..." : "Chat Provider"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING CHAT BOX */}
      {chatOpen && (
        <div className="chat-box">
          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-user">
              <div className="chat-avatar">
                {provider.company_name?.charAt(0)}
              </div>
              <span>{provider.company_name}</span>
            </div>

            <FiX className="chat-close" onClick={() => {
              setChatOpen(false);
              setConversation(null);
              setMessages([]);
            }} />
          </div>

          {/* MESSAGES */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.sender_role === "user" ? "me" : "them"
                }`}
              >
                <div className="message-content">
                  {msg.text}
                  <div className="message-timestamp">
                    {new Date(msg.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="chat-bubble me sending">
                Sending...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              disabled={isSending}
            />
            <button onClick={handleSend} disabled={!text.trim() || isSending}>
              {isSending ? "..." : <FiSend />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}