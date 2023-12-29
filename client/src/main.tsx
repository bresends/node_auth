import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth.tsx';
import './index.css';
import ErrorPage from './pages/404.tsx';
import { Admin } from './pages/Admin.tsx';
import { Editor } from './pages/Editor.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Root } from './pages/Root.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RequireAuth authorizedRoles={['user', 'editor', 'admin']} />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Root />,
                errorElement: <ErrorPage />,
            },
        ],
    },
    {
        path: '/',
        element: <RequireAuth authorizedRoles={['admin', 'editor']} />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/editor',
                element: <Editor />,
                errorElement: <ErrorPage />,
            },
        ],
    },
    {
        path: '/',
        element: <RequireAuth authorizedRoles={['admin']} />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/admin',
                element: <Admin />,
                errorElement: <ErrorPage />,
            },
        ],
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
