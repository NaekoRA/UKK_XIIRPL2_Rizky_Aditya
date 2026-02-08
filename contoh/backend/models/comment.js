const koneksi = require("./db");

// Ambil komentar berdasarkan ID
const getCommentById = (commentId, callback) => {
    const q = `
        SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
    `;
    koneksi.query(q, [commentId], callback);
};


const getCommentsByPostId = (postId, callback) => {
    const q = `
        SELECT c1.*, u.username 
        FROM comments c1 
        JOIN users u ON c1.user_id = u.id
        WHERE c1.post_id = ? 
        ORDER BY c1.created_at ASC
    `;
    koneksi.query(q, [postId], callback);
};

// Tambah komentar baru atau reply
const insertComment = (postId, userId, comment, parentCommentId, callback) => {
    const q = `
        INSERT INTO comments (post_id, user_id, comment, parent_comment_id) 
        VALUES (?, ?, ?, ?)
    `;
    koneksi.query(q, [postId, userId, comment, parentCommentId], callback);
};

// Hapus komentar (hanya jika userId cocok)
const deleteCommentById = (commentId, userId, callback) => {
    const q = `
        DELETE FROM comments 
        WHERE id = ? AND user_id = ?
    `;
    koneksi.query(q, [commentId, userId], callback);
};

module.exports = {
    getCommentsByPostId,
    insertComment,
    deleteCommentById,
    getCommentById
};
