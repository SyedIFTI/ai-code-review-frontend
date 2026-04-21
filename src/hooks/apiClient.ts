import axios from "axios";
import toast from 'react-hot-toast';

const apiClient  =  axios.create({
baseURL:import.meta.env.VITE_SERVER_URL,
    withCredentials:true
})
    apiClient.interceptors.response.use(
    (response) => response,
    async(error)=>{
        const originalRequest = error.config
       console.log("original Request",originalRequest)
        if(error.response.status ===401 && !originalRequest._retry){
            originalRequest._retry =  true
            try {
               await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/set-refreshToken`,{},{withCredentials:true})
              return apiClient(originalRequest) 
            } catch (refreshError) {
                // FIXED: Don't retry original request if refresh fails - prevents infinite loop
                // Avoid infinite reloads if already on /login
                if (window.location.pathname !== '/login' && window.location.pathname !== '/auth/callback') {
                    toast.error('Session expired. Please log in again.');
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
    }
)
export default apiClient 