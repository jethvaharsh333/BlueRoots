import LayoutAuth from "./layout-auth";
import AuthCard from "../../components/auth/auth-card.jsx";
import LoginForm from "../../components/auth/login-form.jsx";

const Login = () => {
    return (  
        <>
        <LayoutAuth>
        <AuthCard
                title="Login"
                label="Welcome Back"
                backButtonLabel="Don't have an account?"
                backButtonName="SignUp"
                backButtonLink="/sign-up"
                isSSO="true"
            >
                <div className="mt-4 w-full">
                    <LoginForm/>
                </div>
            </AuthCard>
        </LayoutAuth>
        </>
    );
}
 
export default Login;