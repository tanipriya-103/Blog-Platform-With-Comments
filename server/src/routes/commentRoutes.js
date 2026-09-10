const express = require('express');
const { getCommentsByPost, createComment, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/posts/:postId/comments', getCommentsByPost);
router.post('/posts/:postId/comments', protect, createComment);
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
