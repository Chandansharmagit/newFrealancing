import React from 'react';

function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Contact:</strong> {user.contacts || 'N/A'}</p>
      <p><strong>Country:</strong> {user.location || 'N/A'}</p>
      <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
      <p><strong>Trips:</strong> {user.trips || 0}</p>
      <p><strong>Countries Visited:</strong> {user.countries || 0}</p>
    </div>
  );
}

export default UserCard;