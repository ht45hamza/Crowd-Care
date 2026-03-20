import * as yup from "yup";

// ─── Auth Schemas ───────────────────────────────────────────

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Incorrect email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First name is required"),
  secondName: yup
    .string()
    .trim()
    .required("Second name is required"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Incorrect email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

// ─── Settings Schemas ───────────────────────────────────────

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "New passwords do not match"),
});

export const editProfileSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First name is required"),
  lastName: yup
    .string()
    .trim()
    .required("Last name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .nullable(),
});

// ─── Campaign Schemas ───────────────────────────────────────

export const startCampaignSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Title is required"),
  category: yup
    .string()
    .required("Category is required"),
  location: yup
    .string()
    .trim()
    .required("Location is required"),
  city: yup
    .string()
    .trim()
    .required("City is required"),
});

export const campaignDetailsSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than 0"),
  durationFrom: yup
    .string()
    .required("Start date is required"),
  durationTo: yup
    .string()
    .required("End date is required"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .max(500, "Description must be 500 characters or less"),
  imageCount: yup
    .number()
    .min(1, "Please attach at least one image"),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(4, "Please enter a valid 4-digit OTP")
    .matches(/^[0-9]+$/, "OTP must contain only digits"),
});
