import api from "./api";

export const subscribeNewsletter = async (email) => {
  const res = await api.post("/newsletter", { email });
  return res.data;
};