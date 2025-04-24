import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:3000" // Local dev server
    : process.env.NEXT_PUBLIC_API_BASE_URL, // Production API URL
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type to JSON only if data is not FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
