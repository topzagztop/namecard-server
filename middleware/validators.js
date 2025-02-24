const { z } = require("zod");

exports.registerSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: z.string().min(6, "Password must be more than 6 characters"),
    firstName: z.string().min(3, "Firstname must be more than 3 characters"),
    lastName: z.string().min(3, "Lastname must be more than 3 characters."),
    phone: z.string().min(10, "Phone must be more than 10 characters."),
    confirmPassword: z
      .string()
      .min(6, "confirmPassword must be more than 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password not Match",
    path: ["confirmPassword"],
  });

exports.loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be more than 6 characters"),
});

exports.validateWithZod = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (err) {
        const errMsg = err.errors.map((item) => item.message)
        const errTxt = errMsg.join(",")
        const mergeError = new Error(errTxt)
        next(mergeError)
    }
}
