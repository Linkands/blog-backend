import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    validations,
    checkAuth,
    handleValidationErrors,
} from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
    .connect(
        'mongodb+srv://admin:wwwwww@cluster0.lhoni.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log('DB error', err);
    });

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
    '/auth/register',
    validations.registerValidation,
    handleValidationErrors,
    UserController.register
);
app.post(
    '/auth/login',
    validations.loginValidation,
    handleValidationErrors,
    UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getPosts);
app.get('/posts/:id', PostController.getPost);
app.post(
    '/posts',
    checkAuth,
    validations.createPostValidation,
    handleValidationErrors,
    PostController.createPost
);
app.delete('/posts/:id', checkAuth, PostController.removePost);
app.patch(
    '/posts/:id',
    checkAuth,
    validations.createPostValidation,
    handleValidationErrors,
    PostController.editPost
);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
