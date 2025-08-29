
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../common/form-field";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schema/login-schema";
import { Button } from "../ui/button";
import { BACKEND_URL } from "../../constant";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import axiosClient from "../../utils/axiosClient";

const LoginForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axiosClient.post(BACKEND_URL + "/auth/login", data);
            console.log(res);
            toast.success(res.data.message);
            navigate("/dashboard");
        } catch (err) {
            console.log(err.response);
            toast.error(err.response.data.message);
            setError(err.response.data.message);
        }
        finally {
            reset();
            setLoading(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Username / Email">
                <input
                    {...register("identifier")}
                    type="text"
                    placeholder="user@123 / user@example.com"
                    className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-200"
                />
                {errors.identifier && (
                    <div className="text-red-500 text-xs mt-[5px]">{errors.identifier.message}</div>
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
                <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-slate-800 hover:underline"
                >
                    Forgot password?
                </Link>            
            </div>

            <Button disabled={isSubmitting} type="submit" className="bg-black hover:bg-opacity-95">
                <span className="text-white text-sm">{isSubmitting ? "Loading..." : "Login"}</span>
            </Button>

            {errors.root && <div className="text-red-500 text-xs mt-[5px]">{errors.root.message}</div>}
        </form>
    );
};


export default LoginForm;