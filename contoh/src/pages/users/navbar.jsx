import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

const CreatePostModal = ({ show, onClose, onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const token = localStorage.getItem("token");

  if (!show) return null; // jangan render modal kalau show=false

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login dulu ya untuk buat post");

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (mediaFile) formData.append("media", mediaFile);

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newPost = await res.json();
        alert("Post berhasil dibuat!");
        onPostCreated(newPost);
        setCaption("");
        setMediaFile(null);
        onClose();
      } else {
        alert("Gagal membuat post");
      }
    } catch (error) {
      console.error(error);
      alert("Error saat membuat post");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      onClick={onClose} // klik background tutup modal
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()} // cegah klik di dalam modal menutup modal
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Post</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <textarea
                className="form-control mb-3"
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*,video/*"
                className="form-control"
                onChange={(e) => setMediaFile(e.target.files[0])}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleOpenCreatePost = () => setShowCreatePost(true);
  const handleCloseCreatePost = () => setShowCreatePost(false);

  // opsional: untuk update post di parent, kamu bisa tambahkan prop onPostCreated
  const handlePostCreated = (newPost) => {
    // misal reload data post di halaman utama, atau emit event, atau update state global
    console.log("Post baru dibuat:", newPost);
  };

  return (
    <div className="d-flex vh-100">
      <div
        className="d-flex flex-column p-3 text-white bg-dark"
        style={{ width: "250px" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-4">Menu</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            {/* tombol buka modal create post */}
            <button
              onClick={handleOpenCreatePost}
              className="nav-link text-white btn btn-link text-start p-0"
            >
              <p>&nbsp;&nbsp;&nbsp;Create Post</p>
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="nav-link text-white btn btn-link text-start p-0"
            >
              &nbsp;&nbsp;&nbsp;Logout
            </button>
          </li>
        </ul>
      </div>

      <div
        className="flex-grow-1 p-3"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        <Outlet />
      </div>

      {/* Modal Create Post */}
      <CreatePostModal
        show={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Sidebar;
