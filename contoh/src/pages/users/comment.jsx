import React, { useEffect, useState } from "react";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
    const data = await res.json();
    const tree = buildCommentTree(data);
    setComments(tree);
  };

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach((comment) => {
      comment.replies = [];
      map[comment.id] = comment;
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        map[comment.parent_comment_id]?.replies.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !newComment) return;

    const res = await fetch(`http://localhost:5000/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment: newComment,
        parentCommentId: replyTo, // null jika komentar utama
      }),
    });

    if (res.ok) {
      setNewComment("");
      setReplyTo(null);
      fetchComments();
    }
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token || !window.confirm("Yakin hapus komentar?")) return;

    await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchComments();
  };

  const renderComment = (comment, depth = 0) => (
    <div key={comment.id} style={{ marginLeft: depth * 20 }}>
      <div>
        <strong>{comment.username}</strong>: {comment.comment}
      </div>

      <div className="d-flex gap-2 mb-2">
        <button
          className="btn btn-sm btn-link p-0"
          onClick={() => setReplyTo(comment.id)}
        >
          Balas
        </button>
        {comment.user_id?.toString() === currentUserId && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(comment.id)}
          >
            Hapus
          </button>
        )}
      </div>

      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={replyTo ? "Balas komentar..." : "Tulis komentar..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        {replyTo && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setReplyTo(null)}
          >
            Batal
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Kirim
        </button>
      </form>

      {comments.length === 0 ? (
        <p>Belum ada komentar.</p>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}
    </div>
  );
};

export default Comments;
