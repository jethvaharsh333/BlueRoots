import * as z from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Enter a valid username"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});