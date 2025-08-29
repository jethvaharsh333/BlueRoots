import { useForm } from "react-hook-form";
import FormField from "../common/form-field";
import * as z from "zod";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";


const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"), // use .email() for stronger validation
});

const ForgotPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(BACKEND_URL + "/auth/forgot-password", data);
      localStorage.setItem('email', data.email);
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
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Email">
        <input
          {...register("email")}
          type="text"
          placeholder="user@gmail.com"
          className="w-full py-2 px-3 text-xs border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-black 
                     focus:ring-offset-1 transition-all duration-200"
        />
        {errors.email && (
          <div className="text-red-500 text-xs mt-[5px]">{errors.email.message}</div>
        )}
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="mt-2 bg-black hover:bg-opacity-95 text-white">
        {isSubmitting ? "Submitting..." : "Submit"}

      </Button>

      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      {success && <div className="text-green-500 text-xs mt-2">{success}</div>}
    </form>
  );
};

export default ForgotPasswordForm;
