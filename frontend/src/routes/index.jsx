// src/routes/app-routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoutes } from './public-routes.jsx';
import { citizenRoutes, governmentRoutes, ngoRoutes } from './private-routes.jsx';
import PrivateRoute from '../components/providers/private-routes.jsx';
import CitizenLayout from '../pages/citizen/citizen-layout.jsx';
<<<<<<< HEAD
import NGOLayout from '../pages/ngo/ngo-layout.jsx';
import GovtLayout from '../pages/goverment/govt-layout.jsx';
=======
import GovtLayout from '../pages/government/govt-layout.jsx';
import NgoLayout from '../pages/ngo/ngo-layout.jsx';
>>>>>>> 01448991d2542071fb37bdd226304ba90c44d29b

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {PublicRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}

<<<<<<< HEAD
            {/* Citizen Routes */}
            <Route element={<CitizenLayout />}>
=======
            {/* Citizen Routes: The ENTIRE layout is now protected */}
            <Route 
                element={
                    <PrivateRoute allowedRoles={["CITIZEN"]}>
                        <CitizenLayout />
                    </PrivateRoute>
                }
            >
                {/* The individual routes no longer need their own PrivateRoute */}
>>>>>>> 01448991d2542071fb37bdd226304ba90c44d29b
                {citizenRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>

<<<<<<< HEAD
            {/* NGO Routes */}
            <Route element={<NGOLayout />}>
                {ngoRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <PrivateRoute allowedRoles={["NGO"]}>
                                {route.element}
                            </PrivateRoute>
                        }
                    />
                ))}
            </Route>

            {/* Government Routes */}
            <Route element={<GovtLayout />}>
                {governmentRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <PrivateRoute allowedRoles={["GOVERNMENT"]}>
                                {route.element}
                            </PrivateRoute>
                        }
                    />
                ))}
            </Route>
            <Route path="/unauthorized" element={<h1>403 - Unauthorized</h1>} />
=======
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
>>>>>>> 01448991d2542071fb37bdd226304ba90c44d29b
        </Routes>
    );
};

export default AppRoutes;
