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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://backendtravelagencytwomicroservice.onrender.com/api/team');
        setTeamMembers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.response?.data?.message || 'Failed to load team members.');
      } finally {
        setIsLoading(false);
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
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image (JPEG, JPG, or PNG).');
      return;
    }
    setFormData({ ...formData, image: file });
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await axios.delete(`https://backendtravelagencytwomicroservice.onrender.com/api/team/${id}`);
      setTeamMembers(teamMembers.filter((member) => member._id !== id));
      setSuccess('Team member deleted successfully!');
      setError(null);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setError(error.response?.data?.message || 'Failed to delete team member.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: '', name: '', role: '', bio: '', image: null });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="td-team-dashboard">
      <div className="td-container">
        <h1 className="td-dashboard-title">Team Management Dashboard</h1>

        {/* Form Section */}
        <section className="td-form-section">
          <h2 className="td-section-title">
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          {error && <p className="td-error-message">{error}</p>}
          {success && <p className="td-success-message">{success}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="td-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength="100"
                disabled={isLoading}
              />
            </div>
            <div className="td-form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                maxLength="100"
                disabled={isLoading}
              />
            </div>
            <div className="td-form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                maxLength="500"
                disabled={isLoading}
              ></textarea>
            </div>
            <div className="td-form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                required={!isEditing}
                disabled={isLoading}
              />
            </div>
            <div className="td-form-actions">
              <button type="submit" className="td-submit-button" disabled={isLoading}>
                {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Add'} Team Member
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="td-cancel-button"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Team Members Section */}
        <section className="td-table-section">
          <h2 className="td-section-title">Team Members</h2>
          {isLoading && <p className="td-loading-message">Loading...</p>}
          {error && <p className="td-error-message">{error}</p>}
          {teamMembers.length > 0 ? (
            <div className="td-team-grid">
              {teamMembers.map((member) => (
                <div key={member._id} className="td-team-card">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="td-team-image"
                  />
                  <div className="td-team-info">
                    <h3>{member.name}</h3>
                    <p className="td-role">{member.role}</p>
                    <p className="td-bio">{member.bio.substring(0, 100)}...</p>
                    <div className="td-team-actions">
                      <button
                        className="td-edit-button"
                        onClick={() => handleEdit(member)}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        className="td-delete-button"
                        onClick={() => handleDelete(member._id)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="td-no-members">No team members available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamDashboard;