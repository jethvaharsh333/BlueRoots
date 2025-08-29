import AuthCard from "../../components/auth/auth-card";
import ForgotPasswordForm from "../../components/auth/forgot-password-form";
import LayoutAuth from "./layout-auth";

const ForgotPassword = () => {
    return ( 
        <>
        <LayoutAuth>
            <AuthCard
                title="Forgot Password"
                label="Enter your email to reset your password."
                backButtonLabel="Remember your password?"
                backButtonName="Login"
                backButtonLink="/login"
            >
                <div className="mt-4 w-full">
                    <ForgotPasswordForm/>
                </div>
        </AuthCard>

            
        </LayoutAuth>
        
        </>
     );
}
 
export default ForgotPassword;