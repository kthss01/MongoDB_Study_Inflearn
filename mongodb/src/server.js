const express = require('express');
const app = express();
const { userRouter, blogRouter } = require('./routes');
const mongoose = require('mongoose');
// const { generateFakeData } = require('../faker');
const { generateFakeData } = require('../faker2');

const server = async () => {
    
    const { MONGO_URI } = process.env;
    // console.log({ MONGO_URI });
    
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is required!!!");
    }

    // let monodbConnection = await mongoose.connect(MONGO_URI);
    // console.log({ monodbConnection });

    try {
        // await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }); 해당 옵션 6.0 이상부터는 다 설정해준다고함 안해도됨
        await mongoose.connect(MONGO_URI, { });
        
        // mongoose.set('debug', true);
        console.log('MongoDB connected');

        app.use(express.json());
    
        app.use('/user', userRouter); // 미들웨어 추가
        app.use('/blog', blogRouter);
        
        app.listen(3000, async () => {
            console.log("server listening on port 3000");
            // await generateFakeData(1000000, 10, 50);
            // await generateFakeData(10, 2, 10);
            // await generateFakeData(10, 10, 10);
            // await generateFakeData(3, 10, 50);
            // await generateFakeData(3, 5, 20);

            // for (let i = 0; i < 20; i++) {
            //     await generateFakeData(10, 1, 10);
            // }
        });
    } catch (err) {
        console.log("err");
        // console.log(err);
    }


};

server();

