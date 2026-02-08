const VoteModel = require("../models/votes");

const votePost = (req, res) => {
  const {type } = req.body; 
  const postId = req.params.postId
  const userId = req.user.id;

  if (!postId || !type || !["upvote", "downvote"].includes(type)) {
    return res.status(400).json({ message: "Data vote tidak valid" });
  }

  VoteModel.upsertVote(postId, userId, type, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal vote post" });
    }
    res.json({ message: "Vote berhasil" });
  });
};

const removeVote = (req, res) => {
  const postId  = req.params.postId
  const userId = req.user.id;

  if (!postId) {
    return res.status(400).json({ message: "Post ID harus diisi" });
  }

  VoteModel.deleteVote(postId, userId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal hapus vote" });
    }
    res.json({ message: "Vote dihapus" });
  });
};

const getVotes = (req, res) => {
  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({ message: "Post ID harus diisi" });
  }

  VoteModel.countVotes(postId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data vote" });
    }
    const votes = results[0] || { upvotes: 0, downvotes: 0 };
    res.json({ upvotes: votes.upvotes || 0, downvotes: votes.downvotes || 0 });
  });
};

module.exports = {
  votePost,
  removeVote,
  getVotes,
};
