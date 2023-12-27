import axiosInstance from 'axios';

const API = 'http://localhost:3000';

export const axios = axiosInstance.create({
    baseURL: API,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const registerRequest = async (email: string, password: string) =>
    axios.post('/api/register', { email, password });
