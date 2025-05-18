import React from 'react';

const FilterForm = ({ activeTab, userId, setUserId, tourId, setTourId, findTourId, setFindTourId, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="filter-form">
      {(activeTab === 'user' || activeTab === 'combined') && (
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
           
          />
        </div>
      )}
      {(activeTab === 'tour' || activeTab === 'combined') && (
        <div className="form-group">
          <label htmlFor="tourId">Tour ID:</label>
          <input
            type="text"
            id="tourId"
            value={tourId}
            onChange={(e) => setTourId(e.target.value)}
            placeholder="Enter tour ID"
           
          />
        </div>
      )}
      {/* <div className="form-group">
        <label htmlFor="findTourId">Find by Tour ID:</label>
        <input
          type="text"
          id="findTourId"
          value={findTourId}
          onChange={(e) => setFindTourId(e.target.value)}
          placeholder="Find by tour ID"
        />
      </div> */}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Filter'}
      </button>
    </form>
  );
};

export default FilterForm;