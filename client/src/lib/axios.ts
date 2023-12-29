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

export const axiosPrivate = axiosInstance.create({
    baseURL: API,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const registerRequest = async (email: string, password: string) =>
    axios.post('/api/register', { email, password });

export const loginRequest = async (email: string, password: string) =>
    axios.post('/api/auth', { email, password });

export const userInfoRequest = async (token: string) =>
    axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } });
