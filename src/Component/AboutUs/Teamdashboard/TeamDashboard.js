import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamDashboard.css';

const TeamDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    bio: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('https://backendtravelagencytwomicroservice.onrender.com/api/team');
        setTeamMembers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.response?.data?.message || 'Failed to load team members.');
      }
    };
    fetchTeamMembers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('bio', formData.bio);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      let response;
      if (isEditing) {
        // Update team member
        response = await axios.put(
          `https://backendtravelagencytwomicroservice.onrender.com/api/team/${formData.id}`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setTeamMembers(
          teamMembers.map((member) =>
            member._id === formData.id ? response.data.data : member
          )
        );
        setSuccess('Team member updated successfully!');
      } else {
        // Create team member
        response = await axios.post(
          'https://backendtravelagencytwomicroservice.onrender.com/api/team',
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setTeamMembers([...teamMembers, response.data.data]);
        setSuccess('Team member added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      setError(error.response?.data?.message || 'Failed to save team member.');
    }
  };

  // Handle edit button click
  const handleEdit = (member) => {
    setFormData({
      id: member._id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: null,
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await axios.delete(`https://backendtravelagencytwomicroservice.onrender.com/api/team/${id}`);
      setTeamMembers(teamMembers.filter((member) => member._id !== id));
      setSuccess('Team member deleted successfully!');
      setError(null);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setError(error.response?.data?.message || 'Failed to delete team member.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: '', name: '', role: '', bio: '', image: null });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="team-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Team Management Dashboard</h1>

        {/* Form Section */}
        <section className="form-section">
          <h2 className="section-title">
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                maxLength="500"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                required={!isEditing}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {isEditing ? 'Update' : 'Add'} Team Member
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Team Members Table */}
        <section className="table-section">
          <h2 className="section-title">Team Members</h2>
          {error && <p className="error-message">{error}</p>}
          {teamMembers.length > 0 ? (
            <table className="team-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Image</th>
                  <th>Bio</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member._id}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>
                      <img
                        src={member.image}
                        alt={`${member.name}`}
                        className="table-image"
                      />
                    </td>
                    <td>{member.bio.substring(0, 50)}...</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(member._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-members">No team members available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamDashboard;