import Yup from "yup";

export const userValidation = Yup.object({
  firstName: Yup.string()
    .required("First name is required.")
    .trim()
    .max(32, "First name cannot be more than 32 characters."),
  lastName: Yup.string()
    .required("Last name is required.")
    .trim()
    .max(32, "Last name cannot be more than 32 characters."),
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email.")
    .max(50, "Email cannot be more than 50 characters.")
    .trim()
    .lowercase(),
  password: Yup.string()
    .required("Password is required.")
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(32, "Password cannot be more than 32 characters."),
});
