import * as z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3, "Enter a valid username or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
