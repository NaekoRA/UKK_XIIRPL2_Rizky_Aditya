const db = require("../models/db");

const getAllPosts = (callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `, callback);
};

const getPostById = (id, callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `, [id], callback);
};

const insertPost = (caption, media, userId, callback) => {
    db.query(
        "INSERT INTO posts (caption, media, user_id) VALUES (?, ?, ?)",
        [caption, media, userId],
        callback
    );
};

const updatePost = (postId, caption, media, callback) => {
    db.query(
        "UPDATE posts SET caption = ?, media = COALESCE(?, media) WHERE id = ?",
        [caption, media, postId],
        callback
    );
};

const deletePost = (postId, callback) => {
    db.query("DELETE FROM posts WHERE id = ?", [postId], callback);
};

const getPostsByUserId = (userId, callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC
    `, [userId], callback);
};
module.exports = {
    getAllPosts,
    getPostById,
    insertPost,
    updatePost,
    deletePost,
    getPostsByUserId,
};