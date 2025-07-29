import { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../services/userService';
import UserTable from '../components/UserTable';
import UserEditModal from '../components/UserEditModal';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await getAllUsers();
    if (res.status === 'success') {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const res = await deleteUser(id);
      if (res.status === 'success') {
        fetchUsers();
      }
    }
  };

  const handleSave = async (id, data) => {
    const res = await updateUser(id, data);
    if (res.status === 'success') {
      setEditingUser(null);
      fetchUsers();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard - User Management</h2>
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {editingUser && <UserEditModal user={editingUser} onSave={handleSave} onClose={() => setEditingUser(null)} />}
    </div>
  );
}
