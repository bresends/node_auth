import axiosInstance from 'axios';

export const axios = axiosInstance.create({
    baseURL: 'http://localhost:3000',
    timeout: 15000,
});
