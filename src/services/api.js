import axios from 'axios';

// Ensure the baseURL matches your backend server address (port 3000 as defined in your setup)
const API_BASE_URL = 'http://localhost:3000/api'; 

const API = axios.create({
  baseURL: API_BASE_URL,
  // Required to send the refresh_token cookie automatically
  withCredentials: true, 
});

// --- 1. Request Interceptor: Inject the Access Token ---
API.interceptors.request.use(
  (config) => {
    // Read the latest token value right before the request is sent
    const token = localStorage.getItem('accessToken'); 
    
    if (token) {
      // Set the Authorization header in the required format: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`; 
    } else {
      // Clean up header if no token exists
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. Response Interceptor: Handle Token Refresh ---
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthError = error.response?.status === 401;
        const isRefreshAttempt = originalRequest.url.includes('/auth/refresh');

        // Check if 401 is due to expired token and it's not already a refresh retry
        if (isAuthError && !isRefreshAttempt && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Call the dedicated refresh endpoint, relying on the refresh_token cookie
                const { data } = await axios.get(`${API_BASE_URL}/auth/refresh`, { withCredentials: true });
                
                // Save new Access Token
                localStorage.setItem('accessToken', data.accessToken);
                
                // Update the Authorization header for the failed request and retry
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return API(originalRequest);

            } catch (refreshError) {
                // Refresh failed (cookie invalid/expired) - force client-side logout
                console.error("Token refresh failed, forcing logout:", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default API;