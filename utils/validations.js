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

export const loginValidation = [
    body('email', 'Must be entered valid email address').isEmail(),
    body('password', 'Password length must be at least 5 letters').isLength({
        min: 5,
    }),
];

export const createPostValidation = [
    body('title', 'Enter title')
        .isLength({
            min: 1,
        })
        .isString(),
    body('text', 'Enter text')
        .isLength({
            min: 1,
        })
        .isString(),
    body('tags').optional().isString(),
    body('imageUrl').optional().isString(),
];
