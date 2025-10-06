import axios from 'axios';

// Determine the base URL based on the current mode
const getBaseURL = () => {
    const mode = import.meta.env.MODE || 'development';
    
    if (mode === 'production') {
        return import.meta.env.VITE_API_BASE_URL_PRODUCTION;
    } else {
        return import.meta.env.VITE_API_BASE_URL_DEVELOPMENT;
    }
};

const baseURL = getBaseURL();

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
});

export default axiosInstance;