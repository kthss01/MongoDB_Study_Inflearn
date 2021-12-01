const { Schema, model, Types } = require('mongoose');
const { CommentSchema } = require('./Comment');

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false }, // 임시저장할 수 있어서 사용 true면 유저들에게 노출, false면 임시저장 상태
    user: new Schema({ 
        _id: { type: Types.ObjectId, required: true, ref: 'user' },
        // _id: { type: Types.ObjectId, required: true, ref: 'user', index: true },
        username: { type: String, requried: true },
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
    }),
    commentsCount: { type: Number, default: 0, required: true },
    comments: [ CommentSchema ],
    }, 
    { timestamps: true },
);

BlogSchema.index({ 'user._id': 1, updatedAt: 1 });
// BlogSchema.index({ title: "text" });
BlogSchema.index({ title: "text", content: "text" });
// BlogSchema.index({ 'user._id': 1, updatedAt: 1 }, { unique: true });
// BlogSchema.index({ updateAt: 1 });

// BlogSchema.virtual("comments", {
//     ref: "comment",
//     localField: "_id",
//     foreignField: "blog"
// });

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model('blog', BlogSchema);

module.exports = { Blog };