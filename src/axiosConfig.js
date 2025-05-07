import axios from 'axios';

const baseURL = 'https://seguros-aps-back.onrender.com/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
});

export default axiosInstance;