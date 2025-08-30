import CitizenDashboard from "../pages/citizen/citizen-dashboard";
import Leaderboard from "../pages/citizen/leaderboard";
import NewReport from "../pages/citizen/new-report";
import Profile from "../pages/citizen/profile";
import Reports from "../pages/citizen/reports";
import ChatBot from "../pages/common/chat-bot";


export const citizenRoutes = [
    { path: "/dashboard", element: <CitizenDashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/reports", element: <Reports /> },
    { path: "/reports/new", element: <NewReport /> },
    { path: "/leaderboard", element: <Leaderboard /> },
    { path: "/chat-bot", element: <ChatBot /> },
];

export const ngoRoutes = [
    // { path: "/dashboard", element: <Dashboard /> },
    // { path: "/satellite-view-report", element: <SatelliteViewReport /> },
    // { path: "/reports", element: <Reports /> },
    // { path: "/verify", element: <Verify /> },
    // { path: "/analytics", element: <Analytics /> },
];

export const governmentRoutes = [
    // { path: "/admin/dashboard", element: <Dashboard /> },
    // { path: "/users", element: <Users /> },
    // { path: "/setting", element: <Setting /> },
];