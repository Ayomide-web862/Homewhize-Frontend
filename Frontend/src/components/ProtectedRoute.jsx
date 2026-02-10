import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ children, roles }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // master bypass rule
  if (user.role === "master") {
    return children;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
