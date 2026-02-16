import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminUsersPage.css";
import { FiUserPlus } from "react-icons/fi";
import api from "../api/axios";

export default function SuperAdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

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

            <div className="form-group">
              <label>Temporary Password</label>
              <input
                type="password"
                placeholder="Temporary Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
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
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.role}</td>
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
