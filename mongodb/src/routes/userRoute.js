const { Router } = require('express');
const userRouter = Router();
const { User, Blog, Comment } = require('../models');
const mongoose = require('mongoose');

userRouter.get('', async (req, res) => {
    try {
        const users = await User.find({}); // 배열 리턴
        // const users = await User.findOne({}); // 객체 리턴
        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.get('/:userId', async (req, res) => {
    try {
        // console.log(req.params);
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ err: "invalid userId" });  
        }
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.post('/', async (req, res) => {
    try {
        let { username, name } = req.body;
        if (!username) {
            return res.status(400).send({ err: "username is required" });
        }
        if (!name || !name.first || !name.last) {
            return res.status(400).send({ err: "Both first and last names are required" });
        } 
        const user = new User(req.body);
        await user.save();
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ err: "invalid userId" });  
        }
        // const user = await User.findOneAndDelete({ _id: userId });
        // await Blog.deleteMany({ "user._id": userId });
        // await Blog.updateMany(
        //     { "comments.user": userId }, 
        //     { $pull: { comments: { user: userId } } }
        // );
        // await Comment.deleteMany({ user: userId });

        const [ user ] = await Promise.all([
            User.findOneAndDelete({ _id: userId }),
            Blog.deleteMany({ "user._id": userId }),
            Blog.updateMany(
                { "comments.user": userId }, 
                { $pull: { comments: { user: userId } } }
            ),
            Comment.deleteMany({ user: userId }),
        ]);

        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ err: "invalid userId" });  
        }
        const { age, name } = req.body;
        if (!age && !name) {
            return res.status(400).send({ err: "age or name is required" });  
        }
        if (age && typeof age !== 'number') {
            return res.status(400).send({ err: "age must be a number" });  
        }
        if (name && typeof name.first !== 'string' && name.last !== 'string') {
            return res.status(400).send({ err: "first and last name must be stinrg" });  
        }
        // 이것도 버전 오르면서 해결된듯
        // let updateBody = {};
        // if (age) updateBody.age = age;
        // if (name) updateBody.name = name;
        
        // console.log(name, age);
        // const user = await User.findByIdAndUpdate(userId, { name, age }, { new: true });
        // const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });

        let user = await User.findById(userId);
        // console.log({ userBeforeEdit: user });
        if (age) user.age = age;
        // console.log({ name }, req.body);
        if (name) {
            user.name = name;
            // await Blog.updateMany({ "user._id": userId }, { "user.name": name });
            // await Blog.updateMany(
            //     {}, 
            //     { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
            //     { arrayFilters: [{ "comment.user": userId }] }
            // );
            await Promise.all([
                Blog.updateMany({ "user._id": userId }, { "user.name": name }),
                Blog.updateMany(
                    {}, 
                    { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
                    { arrayFilters: [{ "comment.user": userId }] }
                )
            ]);
        }
        // console.log({ userAfterEdit: user });
        
        await user.save();
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = { userRouter };