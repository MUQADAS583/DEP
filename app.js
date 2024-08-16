const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Schema and Model
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes

// Index Route
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('index', { blogs });
});

// New Route
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// Create Route
app.post('/blogs', async (req, res) => {
    const { title, content } = req.body;
    await Blog.create({ title, content });
    res.redirect('/blogs');
});

// Show Route
app.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render('show', { blog });
});

// Edit Route
app.get('/blogs/:id/edit', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render('edit', { blog });
});

// Update Route
app.put('/blogs/:id', async (req, res) => {
    const { title, content } = req.body;
    await Blog.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect(`/blogs/${req.params.id}`);
});

// Delete Route
app.delete('/blogs/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
});

// Start the server
app.listen(3000, () => {
    console.log('Blog website server is running on http://localhost:3000');
});
