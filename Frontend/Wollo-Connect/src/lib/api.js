import axios from 'axios'
import { getAccessToken, setAccessToken, clearAccessToken } from './token';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) =>{
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        
        const response = await axiosInstance.post("/auth/refresh");

        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return await axiosInstance(originalRequest);

      } catch (refreshError) {

        clearAccessToken();

        throw refreshError;
      }
    }

    throw error;
  }
);

export default axiosInstance;