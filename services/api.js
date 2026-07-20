import axios from "axios";
import { API_BASE_URL } from "../utils/constant";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the JWT token (if it exists) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;