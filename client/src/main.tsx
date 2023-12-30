import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth.tsx';
import './index.css';
import ErrorPage from './pages/404.tsx';
import { Admin } from './pages/Admin.tsx';
import { Editor } from './pages/Editor.tsx';
import { Login } from './pages/Login.tsx';
import { Lounge } from './pages/Lounge.tsx';
import { Register } from './pages/Register.tsx';
import { Root } from './pages/Root.tsx';
import Unauthorized from './pages/Unauthorized.tsx';
import { PersistAuth } from './components/PersistAuth.tsx';
import Logout from './pages/Logout.tsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/Logout" element={<Logout />} />

            {/* Private Routes */}
            <Route element={<PersistAuth />}>
                <Route
                    element={
                        <RequireAuth
                            authorizedRoles={['user', 'editor', 'admin']}
                        />
                    }
                >
                    <Route path="/" element={<Root />} />
                    <Route path="/lounge" element={<Lounge />} />
                </Route>

                <Route element={<RequireAuth authorizedRoles={['admin']} />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>

                <Route
                    element={
                        <RequireAuth authorizedRoles={['admin', 'editor']} />
                    }
                >
                    <Route path="/editor" element={<Editor />} />
                </Route>
            </Route>

            {/* Catch All */}
            <Route path="*" element={<ErrorPage />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
