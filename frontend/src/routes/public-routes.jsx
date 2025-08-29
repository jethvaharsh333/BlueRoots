import ForgotPassword from "../pages/auth/forgot-password.jsx"
import Login from "../pages/auth/login.jsx"
import Oauth from "../pages/auth/oauth.jsx"
import SignUp from "../pages/auth/sign-up.jsx"
import VerifyEmail from "../pages/auth/verify-email.jsx"
import Layout from "../pages/landing/layout.jsx"
import ResetPassword from "../pages/auth/reset-password.jsx"
import ResendVerificationEmail from "../pages/auth/resend-verfication-email.jsx"

export const PublicRoutes = [
    {
        path: '/',
        element: <Layout />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/sign-up',
        element: <SignUp />,
    },
    {
        path:'/verify-email',
        element:<VerifyEmail/>
    },
    {
        path:'/forgot-password',
        element:<ForgotPassword/>
    },
    {
        path:'/oauth',
        element:<Oauth/>
    },
    {
        path:'/reset-password',
        element:<ResetPassword/>
    },
    {
        path:'/resend-verification-email',
        element:<ResendVerificationEmail/>
    }

]