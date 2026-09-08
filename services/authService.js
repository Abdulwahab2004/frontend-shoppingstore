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

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put("/auth/change-password", data);
  return res.data;
};
export const saveFcmToken = async (token) => {
  const res = await api.post("/auth/fcm-token", { token });
  return res.data;
};