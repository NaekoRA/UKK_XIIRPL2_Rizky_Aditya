const koneksi = require("./db");

// Tambah atau update vote user di sebuah post
const upsertVote = (postId, userId, type, callback) => {
  // type = 'upvote' atau 'downvote'
  const q = `
    INSERT INTO votes (post_id, user_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type), created_at = NOW()
  `;
  koneksi.query(q, [postId, userId, type], callback);
};

// Hapus vote user di sebuah post
const deleteVote = (postId, userId, callback) => {
  const q = `DELETE FROM votes WHERE post_id = ? AND user_id = ?`;
  koneksi.query(q, [postId, userId], callback);
};

// Hitung jumlah upvote dan downvote sebuah post
const countVotes = (postId, callback) => {
  const q = `
    SELECT
      SUM(type = 'upvote') AS upvotes,
      SUM(type = 'downvote') AS downvotes
    FROM votes
    WHERE post_id = ?
  `;
  koneksi.query(q, [postId], callback);
};

module.exports = {
  upsertVote,
  deleteVote,
  countVotes,
};
