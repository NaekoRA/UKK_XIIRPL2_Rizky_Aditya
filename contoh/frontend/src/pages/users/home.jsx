import React, { useEffect, useState } from "react";
import PostCard from "./post";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div>
        {/* Sidebar akan kita pasang di App.jsx supaya selalu ada */}
      </div>
      <div className="container-fluid p-3 overflow-auto" style={{ maxHeight: "100vh" }}>
        {posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Home;
