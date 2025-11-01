import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../common/form-field";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schema/login-schema";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Redux imports
import { useAppDispatch, useAuth } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";

const LoginFormRedux = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Get auth state from Redux
    const { loading, error, isAuthenticated, user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    // Clear any existing errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handle successful login navigation
    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user.role;
            
            if (role === "CITIZEN") {
                navigate("/dashboard");
            } else if (role === "GOVERNMENT") {
                navigate("/govt/dashboard");
            } else if (role === "NGO") {
                navigate("/ngo/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const onSubmit = async (data) => {
        try {
            // Dispatch Redux login action
            const result = await dispatch(loginUser({
                email: data.identifier, // assuming identifier is email
                password: data.password
            }));

            if (loginUser.fulfilled.match(result)) {
                toast.success("Login successful!");
                reset();
                // Navigation is handled by useEffect above
            } else {
                // Handle login failure
                toast.error(result.payload || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("An unexpected error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Redux error if exists */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <FormField
                label="Email or Username"
                name="identifier"
                type="text"
                placeholder="Enter your email or username"
                register={register}
                error={errors.identifier}
                required
            />

            <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                error={errors.password}
                required
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <Link
                        to="/auth/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                    </div>
                ) : (
                    "Sign in"
                )}
            </Button>

            <div className="text-center">
                <span className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/auth/sign-up"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign up
                    </Link>
                </span>
            </div>
        </form>
    );
};

export default LoginFormRedux;