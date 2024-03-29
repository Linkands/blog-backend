import PostModel from '../models/Post.js';

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt get all posts',
        });
    }
};

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            { returnDocument: 'after' },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'couldnt get post',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post not found',
                    });
                }

                res.json(doc);
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt get all posts',
        });
    }
};

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            images: req.body.images,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt create post',
        });
    }
};

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndRemove(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'couldnt remove post',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post not found',
                    });
                }

                res.json({
                    success: true,
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt get all posts',
        });
    }
};

export const editPost = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                images: req.body.images,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt edit post',
        });
    }
};
