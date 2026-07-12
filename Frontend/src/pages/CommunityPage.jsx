import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import "./CommunityPage.css";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id ?? payload.userId ?? null;
    } catch (err) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const api = (await import("../api/axios")).default;
      const { data } = await api.get("/community");
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const api = (await import("../api/axios")).default;
      const { data } = await api.get(`/community/${postId}/comments`);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: data } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      const api = (await import("../api/axios")).default;
      await api.post(`/community/${postId}/comments`, { comment: commentText[postId] });
    } catch (err) {
      console.error(err);
    }

    setCommentText({ ...commentText, [postId]: "" });
    fetchComments(postId);
  };

  const likePost = async (postId) => {
  try {
    const api = (await import("../api/axios")).default;
    const { data } = await api.post(`/community/${postId}/like`);

  setPosts((prev) =>
    prev.map((p) =>
      p.id === postId
        ? {
            ...p,
            liked: data.liked,
            likes: data.liked ? p.likes + 1 : p.likes - 1,
          }
        : p
    )
  );
  } catch (err) {
    console.error(err);
  }
};

const loadMore = async (postId) => {
  const api = (await import("../api/axios")).default;
  const { data } = await api.get(`/community/${postId}/comments`);

  setPosts((prev) =>
    prev.map((p) =>
      p.id === postId ? { ...p, comments: data } : p
    )
  );
};

const handleDeletePost = async (postId) => {
  if (!window.confirm("Delete this post?")) return;

  try {
    const api = (await import("../api/axios")).default;
    await api.delete(`/community/${postId}`);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="community-page">
      <Navbar />

      <div className="community-header">
        <h1>HomeWhize Community</h1>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-content">
              <p>{post.content}</p>


              {/* IMAGES */}
              {post.images?.length > 0 && (
                <div className="post-images">
                  {post.images.map((img, i) => (
                    <img key={i} src={img} alt="post" />
                  ))}
                </div>
              )}

              {/* COMMENTS */}
              <div className="comments-section">
                <h4>
                  <FiMessageCircle /> Comments
                </h4>

                {post.comments?.map((c) => (
                  <div key={c.id} className="comment">
                    <strong>{c.user_name}:</strong> {c.comment}
                  </div>
                ))}

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ""}
                  onFocus={() => fetchComments(post.id)}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddComment(post.id)
                  }
                />

                <div className="post-actions-row">
                <button
                  className={`like-btn ${post.liked ? "liked" : ""}`}
                  onClick={() => likePost(post.id)}
                >
                  {post.liked ? <FaHeart /> : <FaRegHeart />}
                  <span>{post.likes}</span>
                </button>

                {currentUserId && Number(post.user_id) === Number(currentUserId) && (
                  <button
                    className="delete-post-btn"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                )}

                <button
                  className="show-comments-btn"
                  onClick={() => loadMore(post.id)}
                >
                  Show more comments
                </button>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
