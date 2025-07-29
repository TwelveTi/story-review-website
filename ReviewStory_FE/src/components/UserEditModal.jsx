import { useState, useEffect } from 'react';

export default function UserEditModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({ username: '', fullname: '', password: '', role: '' });

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, fullname: user.fullname, password: '', role: user.role });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  if (!user) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#00000088', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <input type="text" name="fullname" placeholder="Fullname" value={formData.fullname} onChange={handleChange} required />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
