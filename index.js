import express from 'express';
import mongoose from 'mongoose';

import checkAuth from './utils/checkAuth.js';
import {
    registerValidation,
    loginValidation,
    createPostValidation,
} from './utils/validations.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

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

app.use(express.json());

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getPosts);
app.get('/posts/:id', PostController.getPost);
app.post('/posts', checkAuth, createPostValidation, PostController.createPost);
// app.delete('/posts/:id', checkAuth, PostController.deletePost);
// app.patch('/posts', checkAuth, PostController.editPost);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
