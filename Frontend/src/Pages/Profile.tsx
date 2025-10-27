import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Your Profile</h2>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Token (preview):</strong></p>
      <pre style={{ maxHeight: 180, overflow: 'auto', background: '#f6f6f6', padding: 8 }}>{token ? token : 'Not signed in'}</pre>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#111', color: '#fff', border: 'none', borderRadius: 6 }}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
