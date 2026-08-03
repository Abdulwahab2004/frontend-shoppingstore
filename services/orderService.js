import api from "./api";

export const createOrder = async (shippingAddress) => {
  const res = await api.post("/orders", { shippingAddress });
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};