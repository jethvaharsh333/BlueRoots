import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import OtpInput from "../ui/otp-input";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";

const VerifyEmailForm = () => {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const time = setTimeout(() => setTimer((prev) => prev - 1), 1000);
            return () => clearTimeout(time);
        }
    }, [timer]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length < 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            if(!email){
                toast.error("Something get wrong.");
                navigate("/resend-verification-email");
            }
            console.log("api firing--->")
            const res = await axiosClient.post(BACKEND_URL + "/auth/verify-email", { email, code:otp});
            console.log(res);
            toast.success(res.data.message);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
            setError(err.response.data.message);
        }
        finally {
            setOtp("");
            setLoading(false);
        }
    };

    const handleResend = () => {
        setTimer(60);
        setOtp("");
        setError("");

        console.log("Resending OTP...");

        // Example API call:
        // fetch("/api/resend-otp", { method: "POST" });
    };

    const renderButtonText = () => {
        if (loading) return "Loading...";
        if (timer <= 0) return "Resend OTP ➤";
        return "Submit";
    };

    return (
        <form className="w-full grid grid-cols-1 gap-y-5" onSubmit={onSubmit}>
            <div className="flex justify-center">
                <OtpInput length={6} onOtpChange={setOtp} />
            </div>

            <Button
                disabled={loading}
                type={timer <= 0 ? "button" : "submit"}
                onClick={timer <= 0 ? handleResend : undefined}
                className="bg-black hover:bg-opacity-95"
            >
                <span className="text-white text-sm">{renderButtonText()}</span>
            </Button>

            {timer > 0 && (
                <div className="w-full flex justify-center">
                    <span className="text-xs text-slate-400">
                        Resend OTP in {timer} sec.
                    </span>
                </div>
            )}

            {error && <div className="text-red-500 text-xs mt-[-5px]">{error}</div>}
        </form>
    );
};

export default VerifyEmailForm;
