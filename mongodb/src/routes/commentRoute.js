const { Router } = require('express');
const commentRouter = Router({ mergeParams: true });
const { User, Blog, Comment } = require('../models');
const { isValidObjectId } = require('mongoose');

commentRouter.post('/', async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ err: "blogId is invalid" });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ err: "userId is invalid" });
        }
        if (typeof content !== "string") {
            return res.status(400).send({ err: "content is required" });
        }

        const [ blog, user ] = await Promise.all([
            Blog.findById(blogId), 
            User.findById(userId),
        ]);
        // const blog = await Blog.findById(blogId);
        // const user = await User.findById(userId);

        if (!blog || !user) {
            return res.status(400).send({ err: "blog or user does not exist" });
        }
        if (!blog.islive) {
            return res.status(400).send({ err: "blog is not available" });
        }

        const comment = new Comment({ 
            content, 
            user, 
            userFullName: `${user.name.first} ${user.name.last}`, 
            // blog,
            blog: blogId,
        });

        blog.commentsCount++;
        blog.comments.push(comment);
        if (blog.commentsCount > 3) {
            blog.comments.shift(); // 처음께 빠짐
        }

        await Promise.all([ 
            comment.save(),
            blog.save(),
            // Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } }),
        ]);

        // await comment.save();
        // await Blog.updateOne({ _id: blogId }, { $push: { comments: comment } });
        // await Promise.all([
        //     comment.save(),
        //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
        // ]);

        return res.send({ comment });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
});

commentRouter.get('/', async (req, res) => {
    try {
        let { page=0 } = req.query;
        page = parseInt(page);

        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ err: "blogId is invalid" });
        }

        // console.log(page);

        const comments = await Comment.find({ blog: blogId })
            .sort({ createdAt: -1 })
            .skip(page * 3)
            .limit(3);
        // const comments = await Comment.find({ blog: blogId });
        // const comments = await Comment.find({ blog: blogId }).limit(20);
        return res.send({ comments });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
});

commentRouter.patch("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (typeof content !== 'string') {
        return res.status(400).send({ err: "content is reqruied" });
    }

    const [ comment ] = await Promise.all([
        Comment.findOneAndUpdate(
            { _id: commentId }, 
            { content }, 
            { new: true },
        ),
        Blog.updateOne(
            { 'comments._id': commentId },
            { "comments.$.content": content },
        ),
    ]); 

    return res.send({ comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId });

    await Blog.updateOne(
        { "comments._id": commentId }, 
        { $pull: { comments: { _id: commentId } } }
    );

    return res.send({ comment });
});

module.exports = { commentRouter };