import api from "./api";

export const submitContact = async (data) => {
  const res = await api.post("/contact", data);
  return res.data;
};