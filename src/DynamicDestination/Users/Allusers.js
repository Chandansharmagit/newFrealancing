import React, { useState } from 'react';
import UserList from './UserList';
import './styless.css';
import UserCard from './UserCard';

function Allusers() {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUser(null);
  };

  return (
    <div className="app-container">
      <h1>User Management</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => handleTabChange('current')}
        >
          Current User
        </button>
        <button
          className={`tab ${activeTab === 'selected' ? 'active' : ''}`}
          onClick={() => handleTabChange('selected')}
        >
          Selected User
        </button>
      </div>
      {activeTab === 'current' && (
        <>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by username, email, or location..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </div>
          <UserList
            filter={filter}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </>
      )}
      {activeTab === 'selected' && (
        <div className="selected-user">
          {selectedUser ? (
            <UserCard user={selectedUser} />
          ) : (
            <div className="no-users">Select a user to view details</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Allusers;