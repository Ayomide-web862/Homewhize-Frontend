import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminCommunityPage.css";
import { FiImage, FiSend, FiMessageCircle } from "react-icons/fi";

export default function SuperAdminCommunityPage() {
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const api = (await import("../api/axios")).default;
      const { data } = await api.get("/community");
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch posts error:", e);
      setPosts([]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handlePostSubmit = async () => {
    if (!postText && images.length === 0) return;

    const formData = new FormData();
    formData.append("content", postText);
    images.forEach(img => formData.append("images", img));

    try {
      const api = (await import("../api/axios")).default;
      await api.post("/community", formData);
    } catch (err) {
      console.error("Post submission failed:", err);
    }

    setPostText("");
    setImages([]);
    setImagePreviews([]);
    fetchPosts();
  };

  return (
    <SuperAdminLayout>
      <div className="community-container">
        <h2 className="community-title">Community</h2>

        {/* CREATE POST */}
        <div className="community-card">
          <textarea
            placeholder="Share an update with the community..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          {imagePreviews.length > 0 && (
            <div className="image-preview">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="preview" />
              ))}
            </div>
          )}

          <div className="post-actions">
            <label className="upload-btn">
              <FiImage />
              <input type="file" multiple hidden onChange={handleImageChange} />
            </label>

            <button className="post-btn" onClick={handlePostSubmit}>
              <FiSend /> Post
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="posts-list">
          {posts.map((post) => (
            <div className="community-card" key={post.id}>
              <p className="post-text">{post.content}</p>

              {post.images?.length > 0 && (
                <div className="post-images">
                  {post.images.map((img, i) => (
                    <img key={i} src={img} alt="post" />
                  ))}
                </div>
              )}

              <div className="comments-section">
                <h4>
                  <FiMessageCircle /> Comments
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
