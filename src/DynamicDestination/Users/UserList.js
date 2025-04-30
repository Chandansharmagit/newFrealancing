import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';

function UserList({ filter }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:9090/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const userid = user.userId || '';
    const username = user.username || '';
    const email = user.email || '';
    const country = user.country || '';
    return (
      userid.toLowerCase().includes(filter.toLowerCase()) ||
      username.toLowerCase().includes(filter.toLowerCase()) ||
      email.toLowerCase().includes(filter.toLowerCase()) ||
      country.toLowerCase().includes(filter.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-grid">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
}

export default UserList;