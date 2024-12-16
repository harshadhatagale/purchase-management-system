'use client';

import { useEffect, useState } from 'react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        alert('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a user by ID
  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      if (res.ok) {
        alert('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Users</h1>

      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {/* Users Table */}
      <table className="min-w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.id === user._id ? (
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingUser?.id === user._id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                {editingUser?.id === user._id ? (
                  <button
                    onClick={updateUser}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setEditingUser({ id: user._id, ...user })
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No users found.</p>
      )}
    </div>
  );
};

export default AdminUsersPage;
