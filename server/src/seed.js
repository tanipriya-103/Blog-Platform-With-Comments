require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-platform';
    await mongoose.connect(uri);

    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@example.com', password: hashedPassword },
      { name: 'Bob Martin', email: 'bob@example.com', password: hashedPassword },
    ]);

    const posts = await Post.insertMany([
      {
        title: 'Why community-driven blogs work',
        content: 'Community-driven blogs create richer conversations, stronger feedback loops, and more authentic engagement. Writers benefit from comments that challenge ideas, expand perspectives, and make each article more useful to readers. When communities are active, content feels alive rather than static.',
        category: 'Writing',
        tags: ['community', 'writing', 'engagement'],
        author: users[0]._id,
      },
      {
        title: 'A simple approach to modern web development',
        content: 'Modern web development is less about one perfect stack and more about choosing tools that let teams move quickly without sacrificing quality. Frontend frameworks, backend APIs, and databases each play a role. Good architecture reduces friction and makes every release easier to maintain.',
        category: 'Technology',
        tags: ['web', 'frontend', 'backend'],
        author: users[1]._id,
      },
    ]);

    await Comment.insertMany([
      {
        post: posts[0]._id,
        author: users[1]._id,
        content: 'This is a great reminder that comments are part of the value of a blog.',
      },
      {
        post: posts[1]._id,
        author: users[0]._id,
        content: 'I agree that clear architecture makes a big difference for teams.',
      },
    ]);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
