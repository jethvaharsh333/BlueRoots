import google from '../../assets/google.svg';
import github from '../../assets/github.svg';
import { Link, useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';
import { Button } from '../ui/button';



const AuthCard = ({ title, label, backButtonLabel, backButtonName, backButtonLink, children, isSSO }) => {
     return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl grid grid-cols-1  justify-items-center flex-col py-6 px-6 w-[400px]"
        >

            {/* Card Header */}
            <div className="text-3xl text-black font-bold">
                🔐 {title}
            </div>

            {/* Card SubHeading */}
            <div className="mt-1">
                <span className="text-sm font-light text-slate-800">
                    {label}
                </span>
            </div>

            {children}

            {isSSO && (
                <>
                    <div className="flex items-center w-full my-3">
                        <div className="flex-grow h-px bg-slate-200 rounded-lg" />
                        <span className="px-3 text-xs text-slate-500">OR</span>
                        <div className="flex-grow h-px bg-slate-200  rounded-lg" />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-4 place-content-between">
                        {/* <SSOButton svg={google} provider="google" />
                        <SSOButton svg={github} provider="github" /> */}
                    </div>
                </>
            )}

            <div className="mt-4 flex gap-x-1">
                <span className="text-xs text-slate-700">
                    {backButtonLabel}
                </span>
                <span className="text-xs font-semibold text-slate-700 cursor-pointer">
                    <Link to={backButtonLink}>{backButtonName}</Link>
                </span>
            </div>
        </motion.div>
    )
}

// const SSOButton = ({ svg, provider }) => {
//     const backendBaseUrl = import.meta.env.VITE_SERVER_URL;
//     const navigate = useNavigate();

//     const handleOAuthLogin = async () => {
//         // try {
//         //     const url = await fetchOAuthRedirect(provider);
//         //     navigate(url);
//         // } catch (error) {
//         //     console.error("OAuth error:", error);
//         // }
//         window.location.href = backendBaseUrl + "/auth/" + provider;
//     };


//     return (
//         // <Link to={`${backendBase}/oauth/${provider}`} className="w-full">
//         <Button className="border py-3 text-sm hover:bg-slate-200" onClick={handleOAuthLogin}>
//             <img src={svg} className="h-4 w-4" />
//         </Button>
//         // </Link>
//     )
// }
 
export default AuthCard;