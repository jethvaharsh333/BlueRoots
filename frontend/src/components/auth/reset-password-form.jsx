import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import FormField from "../common/form-field";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";

const resetPasswordSchema = z.object({
  code: z.string().min(6, "Enter the 6-digit code sent to your email"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ResetPasswordForm = () => {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      code: "",
      newPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      if(!email){
          toast.error("Something get wrong.");
          navigate("/resend-verification-email");
      }
      const res = await axiosClient.post(BACKEND_URL + "/auth/reset-password", {...data, email});
      console.log(res);
      toast.success(res.data.message);
      navigate("/reset-password");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data.message);
      setError(err.response.data.message);
    }
    finally {
      reset();
      setLoading(true);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Enter Code">
        <input
          {...register("code")}
          type="text"
          placeholder="Enter 6-digit code"
          className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-black 
                     focus:ring-offset-1 transition-all duration-200"
        />
        {errors.code && (
          <div className="text-red-500 text-xs mt-[5px]">{errors.code.message}</div>
        )}
      </FormField>

      {/* New password field */}
      <FormField label="New Password">
        <input
          {...register("newPassword")}
          type="password"
          placeholder="******"
          className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-black 
                     focus:ring-offset-1 transition-all duration-200"
        />
        {errors.newPassword && (
          <div className="text-red-500 text-xs mt-[5px]">{errors.newPassword.message}</div>
        )}
      </FormField>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="mt-2 bg-black hover:bg-opacity-95 text-white">
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>

      {/* Messages */}
      {serverError && <div className="text-red-500 text-xs mt-2">{serverError}</div>}
      {success && <div className="text-green-500 text-xs mt-2">{success}</div>}
    </form>
  );
};

export default ResetPasswordForm;
