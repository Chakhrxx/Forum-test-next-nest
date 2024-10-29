import axios from "axios";

// Cache environment variables for performance
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Create the Axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies
});

// Add request interceptor to include API key and access token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Include API key if it exists
    if (API_KEY) {
      config.headers["x-api-key"] = API_KEY;
    }

    // Check if we are in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    // Handle request errors, if any
    return Promise.reject(error);
  }
);
