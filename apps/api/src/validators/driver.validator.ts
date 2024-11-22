import { body } from 'express-validator';

export const validatePhoneNumber = [
  body('phone').matches(/^\+[1-9]\d{10,14}$/).withMessage('Invalid phone number format')
];

export const validateOTP = [
  body('phone').matches(/^\+[1-9]\d{10,14}$/).withMessage('Invalid phone number format'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Invalid OTP')
];