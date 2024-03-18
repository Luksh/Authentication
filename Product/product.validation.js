import Yup from "yup";

export const productAddValidation = Yup.object({
  name: Yup.string()
    .required("Product name is required.")
    .trim()
    .max(65, "Product name cannot be more than 65 characters."),
  price: Yup.number().required("Product price is required.").min(0, "Product price cannot be less than 0."),
  quantity: Yup.number().required("Product quantity is required.").min(1, "Product quantity cannot be less than 1."),
});
