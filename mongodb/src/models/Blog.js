const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false }, // 임시저장할 수 있어서 사용 true면 유저들에게 노출, false면 임시저장 상태
    user: { type: Types.ObjectId, required: true, ref: 'user' },
}, { timestamps: true },
);

const Blog = model('blog', BlogSchema);

module.exports = { Blog };