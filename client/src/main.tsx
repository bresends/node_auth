import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './pages/404.tsx';
import { Register } from './pages/Register.tsx';
import { Root } from './pages/Root.tsx';
import { Login } from './pages/Login.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/tasks',
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/404',
        element: <ErrorPage />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
