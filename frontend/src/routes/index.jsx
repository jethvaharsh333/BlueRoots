import { Routes, Route } from 'react-router-dom';
import { PublicRoutes } from './public-routes.jsx';
import { citizenRoutes, governmentRoutes, ngoRoutes } from './private-routes.jsx';
import PrivateRoute from '../components/providers/private-routes.jsx';
import CitizenLayout from '../pages/citizen/citizen-layout.jsx';
import NGOLayout from '../pages/ngo/ngo-layout.jsx';
import GovtLayout from '../pages/goverment/govt-layout.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {PublicRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                />
            ))}

            {/* Citizen Routes */}
            <Route element={<CitizenLayout />}>
                {citizenRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <PrivateRoute allowedRoles={["CITIZEN"]}>
                                {route.element}
                            </PrivateRoute>
                        }
                    />
                ))}
            </Route>

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
        </Routes>
    );
};

export default AppRoutes;
