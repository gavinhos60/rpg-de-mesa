import axios from "axios";

export const api = axios.create({
  // API local — altere se estiver usando um túnel (Cloudflare etc.)
  baseURL: "https://numbers-excited-dealing-innocent.trycloudflare.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});