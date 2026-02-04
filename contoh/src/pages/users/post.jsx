import React, { useState, useEffect } from "react";
import Comments from "./comment";

const PostCard = ({ post, currentUserId, onPostDeleted, onPostUpdated }) => {
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption || "");
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/votes/${post.id}`)
      .then((res) => res.json())
      .then((data) => {
        setVotes({
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
        });
      });
  }, [post.id]);

  const votePost = async (type) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login dulu ya untuk vote");

  try {
    const method = userVote === type ? "DELETE" : "POST";
    const response = await fetch(`http://localhost:5000/api/votes/${post.id}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: method === "POST" ? JSON.stringify({ type: type === "up" ? "upvote" : "downvote" }) : null,
    });

    if (response.ok) {
      // Update status userVote
      setUserVote(userVote === type ? null : type);

      // Ambil ulang jumlah vote
      const votesRes = await fetch(`http://localhost:5000/api/votes/${post.id}`);
      const voteData = await votesRes.json();
      setVotes({ upvotes: voteData.upvotes, downvotes: voteData.downvotes });
    }
  } catch (error) {
    console.error(error);
  }
};


  const handleDelete = async () => {
    if (!window.confirm("Yakin mau hapus post ini?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Login dulu ya");

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Post berhasil dihapus");
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Login dulu ya");

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (mediaFile) formData.append("media", mediaFile);

      const response = await fetch(
        `http://localhost:5000/api/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        alert("Post berhasil diupdate");
        setEditing(false);
        onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderMedia = () => {
    if (!post.media) return null;
    const mediaUrl = `http://localhost:5000/uploads/media/${post.media}`;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(post.media);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(post.media);

    if (isImage)
      return (
        <img
          src={mediaUrl}
          alt="Post media"
          className="img-fluid mb-2"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
      );
    if (isVideo)
      return (
        <video
          controls
          className="img-fluid mb-2"
          style={{ maxHeight: "400px", width: "100%" }}
        >
          <source src={mediaUrl} type="video/mp4" />
          Browser kamu tidak mendukung video.
        </video>
      );
    return null;
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* User Info */}
        <div className="d-flex align-items-center mb-2">
          <img
            src={
              post.profile_pic
                ? `http://localhost:5000/uploads/profiles/${post.profile_pic}`
                : "/images.png"
            }
            alt={post.username}
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <h6 className="mb-0 text-muted">{post.username}</h6>
        </div>

        {/* Edit Mode */}
        {editing ? (
          <form onSubmit={handleUpdate}>
            <textarea
              className="form-control mb-2"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files[0])}
            />
            <button className="btn btn-primary btn-sm me-2" type="submit">
              Simpan
            </button>
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() => setEditing(false)}
            >
              Batal
            </button>
          </form>
        ) : (
          <>
            <p className="card-text">{post.caption}</p>
            {renderMedia()}

            <div className="d-flex align-items-center mb-2">
              <button
                className={`btn btn-sm me-2 ${
                  userVote === "up" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => votePost("up")}
              >
                ▲ {votes.upvotes}
              </button>
              <button
                className={`btn btn-sm me-2 ${
                  userVote === "down" ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => votePost("down")}
              >
                ▼ {votes.downvotes}
              </button>
              <button
                className="btn btn-sm btn-outline-primary ms-auto"
                onClick={() => setShowComments(!showComments)}
              >
                Comments
              </button>
            </div>

            {currentUserId === post.user_id && (
              <div className="mb-2">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}

            {showComments && <Comments postId={post.id} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
