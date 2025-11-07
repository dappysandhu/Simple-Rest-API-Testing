import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/user.js'; 

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
app.get('/api/users/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// POST new user
app.post('/api/users/newuser', async (req, res) => {
  try {
    const { id, email, username } = req.body;
    if (!id || !email) {
      return res.status(400).json({ error: 'id and email are required' });
    }

    const existing = await User.findOne({ id });
    if (existing) {
      return res.status(400).json({ error: 'User with this id already exists' });
    }

    const user = new User({ id, email, username });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// PUT update username
app.put('/api/users/modify/:id', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { username },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE user
app.delete('/api/users/delete/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted', user });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
