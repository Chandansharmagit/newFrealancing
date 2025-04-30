import React, { useState } from 'react';
import UserList from './UserList';
import './styless.css';

function Allusers() {
  const [filter, setFilter] = useState('');

  return (
    <div className="app-container">
      <h1>User Management</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by username, email, or country..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>
      <UserList filter={filter} />
    </div>
  );
}

export default Allusers;