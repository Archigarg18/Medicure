import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Validation middleware runner
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Email validation rules
export const emailValidation = () => [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

// Password validation rules
export const passwordValidation = () => [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Common validation rules
export const nameValidation = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
];

export const phoneValidation = () => [
  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
];

// Appointment validation
export const appointmentValidation = () => [
  body("appointmentDate")
    .isISO8601()
    .withMessage("Please provide a valid appointment date"),
  body("notes").optional().isString(),
];

// Doctor validation
export const doctorValidation = () => [
  body("specialty").notEmpty().withMessage("Specialty is required"),
  body("experience")
    .isInt({ min: 0 })
    .withMessage("Experience must be a positive number"),
  body("consultationFee")
    .isFloat({ min: 0 })
    .withMessage("Consultation fee must be a positive number"),
];

// Medicine validation
export const medicineValidation = () => [
  body("name").trim().notEmpty().withMessage("Medicine name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive number"),
  body("type")
    .isIn(["Tablet", "Injection", "Syrup", "Gel", "Capsule", "Lozenge"])
    .withMessage("Invalid medicine type"),
];
