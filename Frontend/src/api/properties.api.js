import api from "./axios";

export const getAdminProperties = () =>
  api.get("/properties/admin");

export const createProperty = (formData) =>
  api.post("/properties", formData);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`);
