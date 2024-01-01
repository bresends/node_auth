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

export const registerRequest = async (email: string, password: string) => {
    const res = await axios.post('/api/register', { email, password });
    return res.data;
};

export const loginRequest = async (email: string, password: string) => {
    const res = await axios.post('/api/auth', { email, password });
    return res.data;
};

export const passwordResetRequest = async (email: string) => {
    const res = await axios.post('/api/reset_password', { email });
    return res.data;
};

export const userInfoRequest = async (token: string) => {
    const res = await axios.post('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
