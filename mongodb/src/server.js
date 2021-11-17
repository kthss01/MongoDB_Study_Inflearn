const express = require('express');
const app = express();
const { userRouter, blogRouter } = require('./routes');
const mongoose = require('mongoose');
const { generateFakeData } = require('../faker');

const MONGO_URI = 'mongodb+srv://admin:p0cF3wZXe55nWg0r@mongodbtutorial.m6hly.mongodb.net/BlogService?retryWrites=true&w=majority';

const server = async () => {
    // let monodbConnection = await mongoose.connect(MONGO_URI);
    // console.log({ monodbConnection });

    try {
        // await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }); 해당 옵션 6.0 이상부터는 다 설정해준다고함 안해도됨
        await mongoose.connect(MONGO_URI, { });
        
        // await generateFakeData(100, 10, 300);

        // mongoose.set('debug', true);
        console.log('MongoDB connected');

        app.use(express.json());
    
        app.use('/user', userRouter); // 미들웨어 추가
        app.use('/blog', blogRouter);
        
        app.listen(3000, () => console.log("server listening on port 3000"));
    } catch (err) {
        console.log(err);
    }


};

server();

