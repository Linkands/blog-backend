import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Must be entered valid email address').isEmail(),
    body('password', 'Password length must be at least 5 letters').isLength({
        min: 5,
    }),
    body('fullName', 'Name length must be at least 3 letters').isLength({
        min: 3,
    }),
    body('avatarUrl').optional().isURL(),
];
