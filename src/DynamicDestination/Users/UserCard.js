import React from 'react';

function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <p><strong>Userid : </strong>{user.userId}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Contact:</strong> {user.contacts}</p>
      <p><strong>Country:</strong> {user.country}</p>
      <p><strong>City:</strong> {user.city}</p>
      <p><strong>Region:</strong> {user.region}</p>
      <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default UserCard;