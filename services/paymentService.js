import api from "./api";

export const createCheckoutSession = async () => {
  const res = await api.post("/payments/create-checkout-session");
  return res.data;
};