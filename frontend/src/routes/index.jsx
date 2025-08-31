// src/routes/app-routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes } from './public-routes.jsx';
import { citizenRoutes, governmentRoutes, ngoRoutes } from './private-routes.jsx';
import PrivateRoute from '../components/providers/private-routes.jsx';
import CitizenLayout from '../pages/citizen/citizen-layout.jsx';
import GovtLayout from '../pages/government/govt-layout.jsx';
import NgoLayout from '../pages/ngo/ngo-layout.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {PublicRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}

            {/* Citizen Routes: The ENTIRE layout is now protected */}
            <Route 
                element={
                    <PrivateRoute allowedRoles={["CITIZEN"]}>
                        <CitizenLayout />
                    </PrivateRoute>
                }
            >
                {/* The individual routes no longer need their own PrivateRoute */}
                {citizenRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>

            {/* NGO Routes: The ENTIRE layout is now protected */}
            <Route 
                element={
                    <PrivateRoute allowedRoles={["NGO"]}>
                        <NgoLayout />
                    </PrivateRoute>
                }
            >
                {ngoRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>
            
            {/* Government Routes: The ENTIRE layout is now protected */}
            <Route 
                element={
                    <PrivateRoute allowedRoles={["GOVERNMENT"]}>
                        <GovtLayout />
                    </PrivateRoute>
                }
            >
                {governmentRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>

            {/* Other routes */}
            <Route path="/unauthorized" element={<Navigate to="/" replace/>} />
        </Routes>
    );
};

export default AppRoutes;
