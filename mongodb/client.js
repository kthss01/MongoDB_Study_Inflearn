console.log("client code running.");

const axios = require('axios');

const URI = "http://localhost:3000";

// 비효율적인 방법:
//  - blogsLimit 20일 때: 9초 걸리다 끊김

const test = async () => {
    try {
        console.time("loading time: ");
        let { data: { blogs } } = await axios.get(`${URI}/blog`);
        // console.log(blogs.length, blogs[0]);
    
        // blogs = await Promise.all(blogs.map(async blog => {
        //     // const { data: { user } } = await axios.get(`${URI}/${blog.user}`);
        //     // const { data: { comments } } = await axios.get(`${URI}/${blog._id}/comment`);
        //     // blog.user = user;
        //     // blog.comments = comments;
    
        //     const [ res1, res2 ] = await Promise.all([
        //         axios.get(`${URI}/user/${blog.user}`),
        //         axios.get(`${URI}/blog/${blog._id}/comment`),
        //     ]);
    
        //     blog.user = res1.data.user;
        //     blog.comments = await Promise.all(res2.data.comments.map(async comment => {
        //         const { data: { user } } = await axios.get(`${URI}/user/${comment.user}`);
        //         comment.user = user;
        //         return comment;
        //     }));

        //     // blog.comments = res2.data.comments.map(async comment => {
        //     //     try {
        //     //         if (comment.user) {
        //     //             const { data: { user } } = await axios.get(`${URI}/user/${comment.user}`);
        //     //             comment.user = user;
        //     //         }
        //     //         return comment;
        //     //     } catch (err) {
        //     //         console.log(err);
        //     //     }
        //     // });
    
        //     return blog;
        // }));
    
        // console.log(blogs[0]);
        // console.dir(blogs[0], { depth: 10 });
        // console.dir(blogs, { depth: 10 });
        // console.log(blogs);
    } catch (err) {
        console.log(err);
        // console.log('err');
    } finally {
        console.timeEnd("loading time: ");
    }
}

// test();

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
};

testGroup(); // 3 ~ 4초 걸림 이상적인건 200ms 이하가 좋음 500ms도 괜찮긴한데 그것도 높은거긴함