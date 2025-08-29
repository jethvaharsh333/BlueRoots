import AuthCard from "../../components/auth/auth-card";
import ForgotPasswordForm from "../../components/auth/forgot-password-form";
import ResendEmailVerificationForm from "../../components/auth/resend-email-verification-form";
import LayoutAuth from "./layout-auth";

const ResendVerificationEmail = () => {
    return ( 
        <LayoutAuth>
            <AuthCard
                title="Resend Verification Email"
                label="Enter your email to resend the verification email."
                backButtonLabel="Remember your email?"
                backButtonName="Login"
                backButtonLink="/login"
            >
                <div className="mt-4 w-full">
                    <ResendEmailVerificationForm/>
                </div>
            </AuthCard>
        </LayoutAuth>
        
     );
}
 
export default ResendVerificationEmail;