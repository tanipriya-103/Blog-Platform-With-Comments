const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return sendError(res, 404, 'Post not found');
    }

    const comments = await Comment.find({ post: postId }).populate('author', 'name').sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Comments fetched successfully', comments);
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid post id');
    }
    return sendError(res, 500, 'Unable to fetch comments');
  }
};

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return sendError(res, 400, 'Comment content is required');
    }

    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name');
    return sendSuccess(res, 201, 'Comment created successfully', populatedComment);
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid post id');
    }
    return sendError(res, 500, 'Unable to create comment');
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return sendError(res, 404, 'Comment not found');
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'You are not authorized to edit this comment');
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return sendError(res, 400, 'Comment content is required');
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate('author', 'name');
    return sendSuccess(res, 200, 'Comment updated successfully', updatedComment);
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid comment id');
    }
    return sendError(res, 500, 'Unable to update comment');
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return sendError(res, 404, 'Comment not found');
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'You are not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Comment deleted successfully', { id: req.params.id });
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 400, 'Invalid comment id');
    }
    return sendError(res, 500, 'Unable to delete comment');
  }
};

module.exports = { getCommentsByPost, createComment, updateComment, deleteComment };
