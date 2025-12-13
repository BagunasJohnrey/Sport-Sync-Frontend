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
        
        // Safety check: ensure response exists before checking status
        if (!error.response) {
            return Promise.reject(error);
        }

        const isAuthError = error.response.status === 401;
        const isRefreshAttempt = originalRequest.url.includes('/auth/refresh');
        
        // --- FIX: Check if the error came from the login endpoint ---
        const isLoginAttempt = originalRequest.url.includes('/login'); 

        // Check if 401 is due to expired token AND it's not a login attempt
        if (isAuthError && !isRefreshAttempt && !isLoginAttempt && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Call the dedicated refresh endpoint
                const { data } = await axios.get(`${API_BASE_URL}/auth/refresh`, { withCredentials: true });
                
                // Save new Access Token
                localStorage.setItem('accessToken', data.accessToken);
                
                // Update the Authorization header for the failed request and retry
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return API(originalRequest);

            } catch (refreshError) {
                // Refresh failed - force client-side logout
                console.error("Token refresh failed, forcing logout:", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                
                // Only redirect if we aren't already on the login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login'; 
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        // If it was a login error, this line passes it back to your Login.jsx component
        return Promise.reject(error);
    }
);

export default API;