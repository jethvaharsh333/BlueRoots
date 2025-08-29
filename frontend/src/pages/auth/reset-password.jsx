import AuthCard from "../../components/auth/auth-card";
import ResetPasswordForm from "../../components/auth/reset-password-form";
import LayoutAuth from "./layout-auth";


const ResetPassword = () => {
    return ( 
        <>
        <LayoutAuth>
            <AuthCard
                title="Reset Password"
                label="Enter your new password."
                backButtonLabel="Remember your password?"
                backButtonName="Login"
                backButtonLink="/login"
            >
                <div className="mt-4 w-full">
                    <ResetPasswordForm/>
                </div>
        </AuthCard>
        </LayoutAuth>
        
        </>
     );
}
 
export default ResetPassword;