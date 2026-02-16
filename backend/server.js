const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Configure DNS to use Google DNS servers for mongoDB Atlas
const dns = require("dns");
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect(process.env.mongo_url)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 2. Define a Schema (What a "Thought" looks like)
const ThoughtSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});
const Thought = mongoose.model('Thought', ThoughtSchema);

// 3. Routes
// GET all thoughts
app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.json(thoughts);
});

// POST a new thought
app.post('/thoughts', async (req, res) => {
    const newThought = new Thought({ text: req.body.text });
    const savedThought = await newThought.save();
    res.json(savedThought);
});

// DELETE a thought
app.delete('/thoughts/:id', async (req, res) => {
    await Thought.findByIdAndDelete(req.params.id);
    res.json({ message: "Burying successful" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
