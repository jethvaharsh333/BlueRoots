import AuthCard from "../../components/auth/auth-card.jsx";
import VerifyEmailForm from "../../components/auth/verify-email-form.jsx";
import LayoutAuth from "./layout-auth.jsx";

const VerifyEmail = () => {
    return ( 
        <>
        <LayoutAuth>
           <AuthCard
                title="Verify Email"
                label="Enter the 6-digit code sent to your email." 
                backButtonName="Login" 
                backButtonLabel="Already have an account?"
                backButtonLink="/login"
            >
                <div className="mt-4 w-full">
                    <VerifyEmailForm/>
                </div>
            </AuthCard>
        </LayoutAuth>
        
        </>
     );

<>
</>}
 
export default VerifyEmail;