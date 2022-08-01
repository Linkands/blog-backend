import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const reqpassword = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(reqpassword, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            password: passwordHash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { password, ...userData } = user._doc;

        res.json({
            userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt register',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.password
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Wrong user or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { password, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt login',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'No such user',
            });
        }

        const { password, ...userData } = user._doc;

        res.json({
            ...userData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt authenticate',
        });
    }
};
