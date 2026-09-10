const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const payload = posts.map((post) => ({
      ...post.toObject(),
      excerpt: post.content.slice(0, 140) + (post.content.length > 140 ? '...' : ''),
      commentCount: 0,
    }));

    for (let i = 0; i < payload.length; i++) {
      const count = await Comment.countDocuments({ post: payload[i]._id });
      payload[i].commentCount = count;
    }

    return sendSuccess(res, 200, 'Posts fetched successfully', payload);
  } catch (error) {
    return sendError(res, 500, 'Unable to fetch posts');
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    const comments = await Comment.find({ post: post._id }).populate('author', 'name').sort({ createdAt: -1 });
    const payload = {
      ...post.toObject(),
      comments,
      commentCount: comments.length,
    };

    return sendSuccess(res, 200, 'Post fetched successfully', payload);
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid post id');
    }
    return sendError(res, 500, 'Unable to fetch post');
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return sendError(res, 400, 'Title and content are required');
    }

    if (title.trim().length < 3) {
      return sendError(res, 400, 'Title must be at least 3 characters long');
    }

    if (content.trim().length < 10) {
      return sendError(res, 400, 'Content must be at least 10 characters long');
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : 'General',
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 10) : [],
      author: req.user._id,
    });

    const createdPost = await Post.findById(post._id).populate('author', 'name email');
    return sendSuccess(res, 201, 'Post created successfully', createdPost);
  } catch (error) {
    return sendError(res, 500, 'Unable to create post');
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'You are not authorized to edit this post');
    }

    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return sendError(res, 400, 'Title and content are required');
    }

    post.title = title.trim();
    post.content = content.trim();
    post.category = category ? category.trim() : 'General';
    post.tags = Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 10) : [];

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email');
    return sendSuccess(res, 200, 'Post updated successfully', updatedPost);
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid post id');
    }
    return sendError(res, 500, 'Unable to update post');
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'You are not authorized to delete this post');
    }

    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);

    return sendSuccess(res, 200, 'Post deleted successfully', { id: post._id });
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid post id');
    }
    return sendError(res, 500, 'Unable to delete post');
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
