import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../schema/signup-schema";
import FormField from "../common/form-field";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios  from "axios";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../constant";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axiosClient.post(BACKEND_URL+"/auth/register", data);
            console.log(res);
            localStorage.setItem('email', data.email);
            toast.success(res.data.message);
            navigate("/verify-email");
        } catch (err) {
            console.log(err.response);
            toast.error(err.response.data.message);
            setError(err.response.data.message);
        }
        finally{
            reset();
            setLoading(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Username">
                <input
                    {...register("username")}
                    type="text"
                    placeholder="user@123"
                    className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-200"
                />
                {errors.username && (
                    <div className="text-red-500 text-xs mt-[5px]">{errors.username.message}</div>
                )}
            </FormField>

            <FormField label="Email">
                <input
                    {...register("email")}
                    type="text"
                    placeholder="user@gmail.com"
                    className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-200"
                />
                {errors.email && (
                    <div className="text-red-500 text-xs mt-[5px]">{errors.email.message}</div>
                )}
            </FormField>

            <FormField label="Password">
                <input
                    {...register("password")}
                    type="password"
                    placeholder="******"
                    className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-200"
                />
                {errors.password && (
                    <div className="text-red-500 text-xs mt-[5px]">{errors.password.message}</div>
                )}
            </FormField>

            <div className="w-full mb-3">
                <span className="text-xs font-medium text-slate-800 cursor-pointer">Forgot password?</span>
            </div>

            <Button disabled={isSubmitting} type="submit" className="bg-black hover:bg-opacity-95">
                <span className="text-white text-sm">
                    {isSubmitting ? "Loading..." : "Create an account"}
                </span>
            </Button>

            {errors.root && <div className="text-red-500 text-xs mt-[5px]">{errors.root.message}</div>}
            {error && <div className="text-red-500 text-xs mt-[5px]">{error}</div>}
        </form>
    );
};

export default SignUpForm;
