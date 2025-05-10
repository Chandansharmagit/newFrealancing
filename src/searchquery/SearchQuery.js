import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import './SearchQuery.css';

const SearchQuery = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filterOpen, setFilterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchSearchResults = useCallback(
    async (newPage = 1, sort = sortBy) => {
      setLoading(true);
      setError('');
      setSearchResults([]);
      setSearchMessage('');

      const params = new URLSearchParams(location.search);
      const destination = params.get('destination') || '';
      const checkIn = params.get('checkIn') || '';
      const checkOut = params.get('checkOut') || '';

      try {
        const response = await fetch('http://localhost:5000/api/tours/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, checkIn, checkOut, page: newPage, limit: 10, sort }),
        });

        const data = await response.json();
        if (data.success) {
          setSearchResults(data.results);
          setSearchMessage(data.message);
          setPage(data.page);
          setTotalPages(data.pages);
        } else {
          setError(data.error || 'Failed to fetch tours');
        }
      } catch (error) {
        setError('An error occurred while searching. Please try again.');
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, location.search]
  );

  useEffect(() => {
    fetchSearchResults();
  }, [location.search, fetchSearchResults]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(location.search);
      params.set('page', newPage);
      navigate(`/search?${params.toString()}`);
      fetchSearchResults(newPage);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    fetchSearchResults(1, newSort);
    setFilterOpen(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  const getSearchParams = () => {
    const params = new URLSearchParams(location.search);
    const destination = params.get('destination') || 'Any destination';
    const checkIn = params.get('checkIn') ? new Date(params.get('checkIn')).toLocaleDateString() : 'Any date';
    const checkOut = params.get('checkOut') ? new Date(params.get('checkOut')).toLocaleDateString() : 'Any date';
    return { destination, checkIn, checkOut };
  };

  const { destination, checkIn, checkOut } = getSearchParams();

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(<button key="1" onClick={() => handlePageChange(1)} className="page-number">1</button>);
      if (startPage > 2) pages.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`page-number ${i === page ? 'active' : ''}`}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
      pages.push(<button key={totalPages} onClick={() => handlePageChange(totalPages)} className="page-number">{totalPages}</button>);
    }

    return pages;
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <button className="back-button" onClick={handleBackToHome} aria-label="Back to home">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="search-info">
          <div className="search-destination">
            <MapPin size={18} />
            <span>{destination}</span>
          </div>
          <div className="search-dates">
            <Calendar size={18} />
            <span>{checkIn} - {checkOut}</span>
          </div>
        </div>
        <button className="filter-button" onClick={toggleFilters} aria-label="Filter results">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </header>

      {filterOpen && (
        <div className="filter-menu">
          <div className="filter-option">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
          </div>
        </div>
      )}

      <div className="search-results-container">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Searching for tours...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button className="retry-button" onClick={() => fetchSearchResults()}>Retry</button>
          </div>
        ) : (
          <>
            {searchMessage && <div className="results-count">{searchMessage}</div>}
            {searchResults.length > 0 ? (
              <div className="results-list">
                {searchResults.map(tour => (
                  <div key={tour._id} className="tour-card">
                    <div className="tour-image">
                      {tour.images.length > 0 && tour.images[0].url ? (
                        <img src={tour.images[0].url} alt={tour.name} loading="lazy" />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                      <div className="tour-duration">{tour.duration} days</div>
                    </div>
                    <div className="tour-details">
                      <h3 className="tour-name">{tour.name}</h3>
                      <div className="tour-location">
                        <MapPin size={16} />
                        <span>{tour.itinerary[0]?.location || 'Various Locations'}</span>
                      </div>
                      <p className="tour-description">{tour.description}</p>
                      <div className="tour-footer">
                        <span className="tour-price">${tour.price}</span>
                        <a href={`/tour/${tour._id}`} className="tours-section-btn-details">View Details</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-container">
                <h3>No Tours Found</h3>
                <p>Try different search criteria or explore featured destinations.</p>
                <button className="explore-button" onClick={handleBackToHome}>Explore</button>
              </div>
            )}
            {searchResults.length > 0 && totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pagination-button prev"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                  <span>Prev</span>
                </button>
                <div className="pagination-pages">{renderPagination()}</div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-button next"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchQuery;