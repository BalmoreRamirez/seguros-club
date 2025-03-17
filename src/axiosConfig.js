import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
    : import.meta.env.VITE_API_BASE_URL_DEVELOPMENT;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
});

export default axiosInstance;