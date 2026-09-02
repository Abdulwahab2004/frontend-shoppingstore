import { useEffect, useState, useCallback } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/adminService";
import Loader from "../../components/common/Loader";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setActionError("");
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">User Management</h1>

      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

      <div className="bg-white border border-sage rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-sage/50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border border-sage rounded px-2 py-1"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">{u.isVerified ? "Yes" : "No"}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}