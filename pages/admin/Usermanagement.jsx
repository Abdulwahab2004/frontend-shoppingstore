import { useEffect, useState, useCallback, useMemo } from "react";
import { Users, Search, Trash2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { getUsers, updateUserRole, deleteUser } from "../../services/adminService";
import Loader from "../../components/common/Loader";

function Avatar({ name }) {
  const initial = name?.charAt(0).toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-fern/15 text-fern font-semibold flex items-center justify-center text-sm flex-shrink-0">
      {initial}
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Users size={22} className="text-fern" />
          <h1 className="text-2xl font-bold text-dark">User Management</h1>
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {users.length}
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
          />
        </div>
      </div>

      {actionError && (
        <p className="text-red-600 mb-4 bg-red-50 px-3 py-2 rounded-lg text-sm">{actionError}</p>
      )}

      <div className="bg-white border border-sage/60 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3 font-medium">User</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Verified</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-forest">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-sage/40 hover:bg-sage/10 transition-colors duration-150"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} />
                      <div className="min-w-0">
                        <p className="text-dark font-medium truncate">{u.name}</p>
                        <p className="text-xs text-forest truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {u.role === "admin" && <ShieldCheck size={14} className="text-fern" />}
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs border border-sage rounded-md px-2 py-1 outline-none focus:border-fern capitalize transition-colors duration-200"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-3">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        <XCircle size={12} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-forest">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={deletingId === u._id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        aria-label="Delete user"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}