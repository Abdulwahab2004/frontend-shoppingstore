import api from "./api";

export const signupUser = async (formData) => {
  const res = await api.post("/auth/signup", formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};

export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify-email?token=${token}`);
  return res.data;
};