import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_PREFIX || "http://localhost:3000";

const axiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true,
};

export const axiosCommonInstance = axios.create(axiosRequestConfig);

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/reissue`, {}, {
      withCredentials: true,
    });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("ACCESS_TOKEN", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    localStorage.removeItem("ACCESS_TOKEN");
    document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
    throw error;
  }
};

let isRefreshing = false;
let pendingRequests = [];

axiosCommonInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = token; // Bearer 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosCommonInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          pendingRequests.forEach((callback) => callback(newAccessToken));
          pendingRequests = [];
          isRefreshing = false;
          return axiosCommonInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          pendingRequests = [];
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          originalRequest.headers.Authorization = token;
          resolve(axiosCommonInstance(originalRequest));
        });
      });
    }

    if (error.response.status === 403) {
      alert("권한이 없습니다.");
    } else if (error.response.status >= 500) {
      alert("서버 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);
