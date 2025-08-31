import { motion } from "framer-motion";
import LayoutAuth from "./layout-auth";
import AuthCard from "../../components/auth/auth-card.jsx";
import LoginForm from "../../components/auth/login-form.jsx";

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.5, 0.71, 1, 1.5] } }
};

const Login = () => {
    return (
        <LayoutAuth>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <AuthCard
                    title="Login"
                    label="Welcome Back"
                    backButtonLabel="Don't have an account?"
                    backButtonName="SignUp"
                    backButtonLink="/sign-up"
                    isSSO="true"
                >
                    <div className="mt-4 w-full">
                        <LoginForm />
                    </div>
                </AuthCard>
            </motion.div>
        </LayoutAuth>
    );
};

export default Login;
