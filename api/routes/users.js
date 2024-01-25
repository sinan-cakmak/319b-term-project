const express = require("express");

const Post = require("../models/postModel");
const User = require("../models/userModel");

const router = express.Router();

router.put("/addFriend/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findOne({ name: req.body.userName });
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    user.friends.push(friend._id);

    await user.save();
    res.json({ message: "Friend added successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId }).populate("user");

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getUserIdByEmail/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
