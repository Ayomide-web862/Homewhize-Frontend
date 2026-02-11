import api from "./axios";

export const getMe = () => api.get("/auth/me");
export const changePassword = (currentPassword, newPassword) =>
  api.post("/auth/change-password", { currentPassword, newPassword });

export default { getMe, changePassword };
