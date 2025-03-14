import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://seguros-aps-back.onrender.com/api',
    //baseURL: 'http://localhost:3002/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
});

export default axiosInstance;