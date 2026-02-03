import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdminRoles } from '../hooks/useAdminRoles';
import '../css/Admin.css';

export default function Admin() {
  const { isAdmin } = useAuth();
  const { setAdminByEmail, loading, error } = useAdminRoles();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith('@williams.edu')) {
      setSuccess('Only @williams.edu emails are allowed.');
      return;
    }

    const { error: updateError } = await setAdminByEmail(normalizedEmail);
    if (!updateError) {
      setSuccess(`Admin role granted to ${normalizedEmail}`);
      setEmail('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <p className="admin-message">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Panel</h2>
      <p className="admin-subtitle">Grant admin access by email</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          className="admin-input"
          type="email"
          placeholder="user@williams.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="admin-button" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Make Admin'}
        </button>
      </form>

      {error && <p className="admin-error">{error.message}</p>}
      {success && <p className="admin-success">{success}</p>}
    </div>
  );
}