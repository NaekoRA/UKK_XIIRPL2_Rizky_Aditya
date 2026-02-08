const Posts = require("../models/posts");
const multer = require("multer");
const path = require("path");

// Setup multer (TIDAK DIUBAH)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/media');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Controller functions
const getAllPosts = (req, res) => {
    Posts.getAllPosts((err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Format response untuk menyertakan URL lengkap
        const formattedPosts = results.map(post => ({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/avatars/${post.avatar}` : null
        }));

        res.json(formattedPosts);
    });
};

// Fungsi lainnya tetap sama
const getPostById = (req, res) => {
    const postId = req.params.id;
    Posts.getPostById(postId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Post not found" });

        const post = results[0];
        res.json({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/avatars/${post.avatar}` : null
        });
    });
};

const createPost = (req, res) => {
    const { caption } = req.body;
    const userId = req.user.id;

    if (!caption) {
        return res.status(400).json({ error: "Caption harus diisi" });
    }

    const media = req.file ? req.file.filename : null;

    Posts.insertPost(caption, media, userId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: "Post berhasil dibuat",
            postId: results.insertId,
            media
        });
    });
};

const updatePost = (req, res) => {
    const postId = req.params.id;
    const { caption } = req.body;
    const media = req.file ? req.file.filename : null;

    Posts.updatePost(postId, caption, media, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Post berhasil diupdate", media });
    });
};

const deletePost = (req, res) => {
    const postId = req.params.id;

    Posts.deletePost(postId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Post berhasil dihapus" });
    });
};
const getPostsByUserId = (req, res) => {
    const userId = req.params.userId;

    Posts.getPostsByUserId(userId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const formattedPosts = results.map(post => ({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/avatars/${post.avatar}` : null,
        }));

        res.json(formattedPosts);
    });
};
module.exports = {
    upload,
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsByUserId,
};