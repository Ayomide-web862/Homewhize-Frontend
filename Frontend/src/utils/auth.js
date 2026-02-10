// utils/auth.js
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user);
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
