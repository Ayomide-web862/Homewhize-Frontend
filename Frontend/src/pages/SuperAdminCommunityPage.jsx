import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import MediaGallery from "../components/MediaGallery";
import "./SuperAdminCommunityPage.css";
import { FiImage, FiSend, FiMessageCircle, FiTrash2 } from "react-icons/fi";

export default function SuperAdminCommunityPage() {
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeletePostId, setPendingDeletePostId] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

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
    if ((!postText || postText.trim() === "") && images.length === 0) return;
    if (isPosting) return;

    setIsPosting(true);

    const formData = new FormData();
    formData.append("content", postText);
    images.forEach(img => formData.append("images", img));

    try {
      const api = (await import("../api/axios")).default;
      await api.post("/community", formData);
    } catch (err) {
      console.error("Post submission failed:", err);
    } finally {
      setIsPosting(false);
      setPostText("");
      setImages([]);
      setImagePreviews([]);
      fetchPosts();
    }
  };

  const openDeleteModal = (postId) => {
    setPendingDeletePostId(postId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPendingDeletePostId(null);
  };

  const handleDeletePost = async () => {
    if (!pendingDeletePostId) return;

    setDeletingPostId(pendingDeletePostId);

    try {
      const api = (await import("../api/axios")).default;
      await api.delete(`/community/${pendingDeletePostId}`);
      setPosts((prev) => prev.filter((post) => post.id !== pendingDeletePostId));
    } catch (err) {
      console.error("Delete post failed:", err);
    } finally {
      setDeletingPostId(null);
      closeDeleteModal();
    }
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

            <button className="post-btn" onClick={handlePostSubmit} disabled={isPosting}>
              {isPosting ? (
                <>
                  <span className="post-loading-spinner" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="posts-list">
          {posts.map((post) => (
            <div className="community-card" key={post.id}>
              <div className="post-card-actions">
                {currentUserId && Number(post.user_id) === Number(currentUserId) && (
                  <button
                    className="delete-post-btn"
                    onClick={() => openDeleteModal(post.id)}
                    disabled={deletingPostId === post.id}
                  >
                    <FiTrash2 /> {deletingPostId === post.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>

              <p className="post-text">{post.content}</p>

              {post.images?.length > 0 && <MediaGallery images={post.images} className="community-media-gallery" />}

              <div className="comments-section">
                <h4>
                  <FiMessageCircle /> Comments
                </h4>
              </div>
            </div>
          ))}
        </div>

        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={closeDeleteModal}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Delete post?</h3>
              <p>This action cannot be undone.</p>
              <div className="delete-modal-actions">
                <button className="cancel-delete-btn" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button className="confirm-delete-btn" onClick={handleDeletePost}>
                  {deletingPostId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </SuperAdminLayout>
  );
}
