import { Routes, Route } from 'react-router-dom';
import { PublicRoutes } from './public-routes.jsx';
import { citizenRoutes, governmentRoutes, ngoRoutes } from './private-routes.jsx';
import PrivateRoute from '../components/providers/private-routes.jsx';
import CitizenLayout from '../pages/citizen/citizen-layout.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {PublicRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                />
            ))}

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

            {ngoRoutes.map((route, index) => {
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <PrivateRoute allowedRoles={["NGO"]}>
                            {route.element}
                        </PrivateRoute>
                    }
                />
            })}

            {governmentRoutes.map((route, index) => {
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <PrivateRoute allowedRoles={["GOVERNMENT"]}>
                            {route.element}
                        </PrivateRoute>
                    }
                />
            })}

        </Routes>
    );
}

export default AppRoutes;