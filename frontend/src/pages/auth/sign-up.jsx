import AuthCard from "../../components/auth/auth-card.jsx";
import SignUpForm from "../../components/auth/signup-form.jsx";
import LayoutAuth from "./layout-auth.jsx";

const SignUp = () => {
    return ( 
        <>
        <LayoutAuth>
             <AuthCard
                title="Sign Up"
                label="Create an account" 
                backButtonLabel="Already have an account?" 
                backButtonName="Login"
                backButtonLink="/login"
                isSSO="true"
            >
                <div className="mt-5 w-full">
                    <SignUpForm/>
                </div>
            </AuthCard>
        </LayoutAuth>
        
        </>
     );
}
 
export default SignUp;