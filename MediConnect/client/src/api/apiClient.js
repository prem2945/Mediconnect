import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    url = url.replace(/\/$/, '');
    if (!url.endsWith('/api/v1')) {
        url = `${url}/api/v1`;
    }
    return url;
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
