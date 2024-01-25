const express = require("express");

const Post = require("../models/postModel");
const User = require("../models/userModel");

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const posts = await Post.find().populate('user');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/friendsPosts/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendsPosts = await Post.find({ user: { $in: user.friends } }).populate('user');
    res.json(friendsPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('user');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add/:userId", async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      user: req.params.userId,
    });

    await newPost.save();
    res.status(201).json({ message: "Post added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const updateData = req.body;

    let post = await Post.findByIdAndUpdate(postId, updateData, { new: true }).populate('user');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;