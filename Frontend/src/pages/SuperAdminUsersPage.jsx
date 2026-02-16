import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminUsersPage.css";
import { FiUserPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axios";

export default function SuperAdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 25;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      const { data } = await api.get("/admin/admins");
      setAdmins(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    setDeleteLoading(id);
    try {
      await api.delete(`/admin/delete-admin/${id}`);
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Error deleting user");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (admin) => {
    setEditingId(admin.id);
    setEditFormData({
      name: admin.name,
      email: admin.email,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (id) => {
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    setSaveLoading(true);
    try {
      await api.put(`/admin/update-admin/${id}`, {
        name: editFormData.name,
        email: editFormData.email,
      });
      
      // Update the local state
      setAdmins(admins.map(admin => 
        admin.id === id 
          ? { ...admin, name: editFormData.name, email: editFormData.email }
          : admin
      ));
      
      setEditingId(null);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Error updating user");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: "", email: "" });
  };



  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddOwner = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/admin/create-admin", formData);

      alert("Admin account created successfully");

      setFormData({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating owner");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGINATION LOGIC ================= */

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = admins.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(admins.length / usersPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /* ===================================================== */

  return (
    <SuperAdminLayout>
      <div className="users-container">
        <h2 className="users-title">Property Owners</h2>

        {/* CREATE OWNER FORM */}
        <div className="users-card">
          <h3 className="section-title">
            <FiUserPlus size={20} /> Register New Property Owner
          </h3>

          <form onSubmit={handleAddOwner} className="create-owner-form">
            <div className="form-group">
              <label>Owner Name</label>
              <input
                type="text"
                placeholder="Owner Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Owner Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group password-group">
              <label>Temporary Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Temporary Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>


            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Owner Account"}
            </button>
          </form>
        </div>

        {/* OWNERS TABLE */}
        <div className="users-card">
          <h3 className="section-title">Registered Owners</h3>

          <div className="table-wrapper">
            <table className="owners-table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>

                </tr>
              </thead>


              <tbody>
                {currentUsers.map((admin, index) => (
                  <tr key={admin.id} className={editingId === admin.id ? 'editing-row' : ''}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    
                    {editingId === admin.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            className="edit-input"
                            placeholder="Enter name"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleEditInputChange}
                            className="edit-input"
                            placeholder="Enter email"
                          />
                        </td>
                        <td>{admin.role}</td>
                      </>
                    ) : (
                      <>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                      </>
                    )}

                    <td className="actions-cell">
                      {editingId === admin.id ? (
                        <>
                          <button
                            className="action-btn save-btn"
                            onClick={() => handleSaveEdit(admin.id)}
                            disabled={saveLoading}
                          >
                            {saveLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="action-btn cancel-btn"
                            onClick={handleCancelEdit}
                            disabled={saveLoading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <FiEdit2
                            className="action-icon edit"
                            onClick={() => handleEditClick(admin)}
                            title="Edit user"
                          />

                          <FiTrash2
                            className="action-icon delete"
                            onClick={() => handleDelete(admin.id)}
                            title="Delete user"
                            style={{ opacity: deleteLoading === admin.id ? 0.5 : 1, cursor: deleteLoading === admin.id ? 'not-allowed' : 'pointer' }}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>




            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`page-number ${
                    currentPage === i + 1 ? "active-page" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
