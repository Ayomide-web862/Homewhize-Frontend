import axios from "./axios";

export const startConversation = async (providerId) => {
  const { data } = await axios.post("/messages/start", { providerId });
  return data;
};

export const getProviderChats = async () => {
  const { data } = await axios.get("/messages/provider");
  return data;
};

export const getUserChats = async () => {
  const { data } = await axios.get("/messages/user");
  return data;
};

export const getMessages = async (conversationId) => {
  const { data } = await axios.get(`/messages/${conversationId}`);
  return data;
};

export const sendMessage = async (conversationId, text) => {
  const { data } = await axios.post("/messages/send", {
    conversationId: parseInt(conversationId),
    text
  });
  return data;
};