import CitizenDashboard from "../pages/citizen/citizen-dashboard";
import Leaderboard from "../pages/citizen/leaderboard";
import NewReport from "../pages/citizen/new-report";
import Profile from "../pages/citizen/profile";
import ReportDetail from "../pages/citizen/report-detail";
import Reports from "../pages/citizen/reports";
import GovtDashboard from "../pages/government/govt-dashboard";
import NGODashboard from "../pages/ngo/ngo-dashboard";


export const citizenRoutes = [
    { path: "/dashboard", element: <CitizenDashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/reports", element: <Reports /> },
    { path: "/reports/:id", element: <ReportDetail /> },
    { path: "/reports/new", element: <NewReport /> },
    { path: "/leaderboard", element: <Leaderboard /> },
];

export const ngoRoutes = [
    { path: "/ngo/dashboard", element: <NGODashboard/> },
    // { path: "/satellite-view-report", element: <SatelliteViewReport /> },
    // { path: "/reports", element: <Reports /> },
    // { path: "/verify", element: <Verify /> },
    // { path: "/analytics", element: <Analytics /> },
];

export const governmentRoutes = [
    { path: "/govt/dashboard", element: <GovtDashboard /> },
    // { path: "/users", element: <Users /> },
    // { path: "/setting", element: <Setting /> },
];