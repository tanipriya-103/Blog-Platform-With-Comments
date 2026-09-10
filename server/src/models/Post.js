const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: 10,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 50,
      default: 'General',
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ title: 'text', content: 'text', category: 'text' });

module.exports = mongoose.model('Post', postSchema);
