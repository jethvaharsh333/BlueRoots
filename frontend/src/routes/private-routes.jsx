import CitizenDashboard from "../pages/citizen/citizen-dashboard";
import Leaderboard from "../pages/citizen/leaderboard";
import NewReport from "../pages/citizen/new-report";
import Profile from "../pages/citizen/profile";
import ReportDetail from "../pages/citizen/report-detail";
import Reports from "../pages/citizen/reports";
import ChatBot from "../pages/common/chat-bot";
import GovtAddUser from "../pages/government/govt-add-user";
import GovtAlert from "../pages/government/govt-alerts";
import GovtAnalytics from "../pages/government/govt-analytics";
import GovtDashboard from "../pages/government/govt-dashboard";
import Users from "../pages/government/users";
import NgoAnalytics from "../pages/ngo/ngo-analytics";
import NgoCreateAlert from "../pages/ngo/ngo-create-alert";
import NGODashboard from "../pages/ngo/ngo-dashboard";
import NgoSatelliteReports from "../pages/ngo/ngo-satellite-view-reports";
import NgoVerify from "../pages/ngo/ngo-verify";


export const citizenRoutes = [
    { path: "/dashboard", element: <CitizenDashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/reports", element: <Reports /> },
    { path: "/reports/:id", element: <ReportDetail /> },
    { path: "/reports/new", element: <NewReport /> },
    { path: "/leaderboard", element: <Leaderboard /> },
    { path: "/chat-bot", element: <ChatBot /> },
];

export const ngoRoutes = [
    { path: "/ngo/dashboard", element: <NGODashboard/> },
    {path:"/ngo/satellite-view-report",element:<NgoSatelliteReports/>},
    // { path: "/reports", element: <Reports /> },
    {path:"/ngo/verify", element:<NgoVerify/>},
    {path:"/ngo/analytics",element:<NgoAnalytics/>},
    {path:"/ngo/create-alert",element:<NgoCreateAlert/>},
    {path:"/ngo/reports",element:<NgoCreateAlert/>},
    // { path: "/verify", element: <Verify /> },
    // { path: "/analytics", element: <Analytics /> },
];

export const governmentRoutes = [
    { path: "/govt/dashboard", element: <GovtDashboard /> },
    {path:"/govt/add-user",element:<GovtAddUser/>},
    {path:"/govt/analytics",element:<GovtAnalytics/>},
    {path:"/govt/alerts",element:<GovtAlert/>},
    {path:"/govt/users",element:<Users/>},
    // { path: "/setting", element: <Setting /> },
];