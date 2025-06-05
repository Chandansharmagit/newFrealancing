import React, { useState, useEffect } from "react";
import {
  Plane,
  Calendar,
  MapPin,
  Users,
  ArrowLeftRight,
  Search,
  Filter,
 
  Star,
  Wifi,
  Coffee,
  Luggage,
  Shield,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import "./FlightBooking.css";

const FlightBooking = () => {
  const [bookingData, setBookingData] = useState({
    tripType: "roundtrip",
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    class: "economy",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    airlines: [],
    stops: "any",
    departureTime: "any",
  });

  // Mock flight data
  const mockFlights = [
    {
      id: 1,
      airline: "SkyLine Airways",
      logo: "✈️",
      price: 542,
      currency: "USD",
      departure: {
        time: "08:30",
        airport: "JFK",
        city: "New York",
      },
      arrival: {
        time: "14:45",
        airport: "LAX",
        city: "Los Angeles",
      },
      duration: "6h 15m",
      stops: 0,
      amenities: ["wifi", "meals", "entertainment"],
      rating: 4.5,
      baggage: "1 carry-on, 1 checked bag",
      aircraft: "Boeing 737-800",
    },
    {
      id: 2,
      airline: "Pacific Wings",
      logo: "🛫",
      price: 489,
      currency: "USD",
      departure: {
        time: "12:15",
        airport: "JFK",
        city: "New York",
      },
      arrival: {
        time: "19:30",
        airport: "LAX",
        city: "Los Angeles",
      },
      duration: "7h 15m",
      stops: 1,
      amenities: ["wifi", "snacks"],
      rating: 4.2,
      baggage: "1 carry-on",
      aircraft: "Airbus A320",
    },
    {
      id: 3,
      airline: "Continental Express",
      logo: "🛩️",
      price: 678,
      currency: "USD",
      departure: {
        time: "16:20",
        airport: "JFK",
        city: "New York",
      },
      arrival: {
        time: "20:35",
        airport: "LAX",
        city: "Los Angeles",
      },
      duration: "5h 15m",
      stops: 0,
      amenities: ["wifi", "meals", "entertainment", "priority"],
      rating: 4.8,
      baggage: "2 carry-on, 2 checked bags",
      aircraft: "Boeing 787-9",
    },
  ];

  const popularDestinations = [
    { code: "LAX", city: "Los Angeles", country: "USA" },
    { code: "LHR", city: "London", country: "UK" },
    { code: "NRT", city: "Tokyo", country: "Japan" },
    { code: "CDG", city: "Paris", country: "France" },
    { code: "DXB", city: "Dubai", country: "UAE" },
    { code: "SYD", city: "Sydney", country: "Australia" },
  ];

  const airlines = [
    "SkyLine Airways",
    "Pacific Wings",
    "Continental Express",
    "Global Air",
    "Ocean Airlines",
  ];

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePassengerChange = (type, value) => {
    setBookingData((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, value),
      },
    }));
  };

  const swapLocations = () => {
    setBookingData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockFlights);
      setIsSearching(false);
    }, 1500);
  };

  const getTotalPassengers = () => {
    return (
      bookingData.passengers.adults +
      bookingData.passengers.children +
      bookingData.passengers.infants
    );
  };

  const getPassengerText = () => {
    const { adults, children, infants } = bookingData.passengers;
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    if (children > 0)
      parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="amenity-icon" />;
      case "meals":
        return <Coffee className="amenity-icon" />;
      case "entertainment":
        return <Star className="amenity-icon" />;
      case "snacks":
        return <Coffee className="amenity-icon" />;
      case "priority":
        return <Shield className="amenity-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="flight-booking-container">
      {/* Header */}
      <div className="booking-header">
        <div className="header-content">
          <div className="header-title">
            <Plane className="header-icon" />
            <h1>Find Your Perfect Flight</h1>
          </div>
          <p className="header-subtitle">
            Book flights to anywhere in the world with the best prices and
            service
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-form">
            {/* Trip Type Selector */}
            <div className="trip-type-selector">
              <button
                type="button"
                className={`trip-type-btn ${
                  bookingData.tripType === "roundtrip" ? "active" : ""
                }`}
                onClick={() => handleInputChange("tripType", "roundtrip")}
              >
                Round Trip
              </button>
              <button
                type="button"
                className={`trip-type-btn ${
                  bookingData.tripType === "oneway" ? "active" : ""
                }`}
                onClick={() => handleInputChange("tripType", "oneway")}
              >
                One Way
              </button>
              <button
                type="button"
                className={`trip-type-btn ${
                  bookingData.tripType === "multicity" ? "active" : ""
                }`}
                onClick={() => handleInputChange("tripType", "multicity")}
              >
                Multi-City
              </button>
            </div>

            {/* Search Fields */}
            <div className="search-fields">
              {/* From/To Section */}
              <div className="location-section">
                <div className="location-input-group">
                  <label className="input-label">
                    <MapPin className="label-icon" />
                    From
                  </label>
                  <input
                    type="text"
                    value={bookingData.from}
                    onChange={(e) => handleInputChange("from", e.target.value)}
                    placeholder="Departure city or airport"
                    className="location-input"
                  />
                </div>

                <button
                  type="button"
                  className="swap-button"
                  onClick={swapLocations}
                >
                  <ArrowLeftRight className="swap-icon" />
                </button>

                <div className="location-input-group">
                  <label className="input-label">
                    <MapPin className="label-icon" />
                    To
                  </label>
                  <input
                    type="text"
                    value={bookingData.to}
                    onChange={(e) => handleInputChange("to", e.target.value)}
                    placeholder="Destination city or airport"
                    className="location-input"
                  />
                </div>
              </div>

              {/* Date Section */}
              <div className="date-section">
                <div className="date-input-group">
                  <label className="input-label">
                    <Calendar className="label-icon" />
                    Departure
                  </label>
                  <input
                    type="date"
                    value={bookingData.departDate}
                    onChange={(e) =>
                      handleInputChange("departDate", e.target.value)
                    }
                    className="date-input"
                  />
                </div>

                {bookingData.tripType === "roundtrip" && (
                  <div className="date-input-group">
                    <label className="input-label">
                      <Calendar className="label-icon" />
                      Return
                    </label>
                    <input
                      type="date"
                      value={bookingData.returnDate}
                      onChange={(e) =>
                        handleInputChange("returnDate", e.target.value)
                      }
                      className="date-input"
                    />
                  </div>
                )}
              </div>

              {/* Passengers and Class Section */}
              <div className="passengers-section">
                <div className="passengers-dropdown-container">
                  <label className="input-label">
                    <Users className="label-icon" />
                    Passengers
                  </label>
                  <button
                    type="button"
                    className="passengers-dropdown-btn"
                    onClick={() =>
                      setShowPassengerDropdown(!showPassengerDropdown)
                    }
                  >
                    <span>{getPassengerText()}</span>
                    {showPassengerDropdown ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {showPassengerDropdown && (
                    <div className="passengers-dropdown">
                      <div className="passenger-type">
                        <span>Adults (12+)</span>
                        <div className="passenger-counter">
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "adults",
                                bookingData.passengers.adults - 1
                              )
                            }
                            disabled={bookingData.passengers.adults <= 1}
                            className="counter-btn"
                          >
                            -
                          </button>
                          <span className="counter-value">
                            {bookingData.passengers.adults}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "adults",
                                bookingData.passengers.adults + 1
                              )
                            }
                            className="counter-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="passenger-type">
                        <span>Children (2-11)</span>
                        <div className="passenger-counter">
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "children",
                                bookingData.passengers.children - 1
                              )
                            }
                            disabled={bookingData.passengers.children <= 0}
                            className="counter-btn"
                          >
                            -
                          </button>
                          <span className="counter-value">
                            {bookingData.passengers.children}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "children",
                                bookingData.passengers.children + 1
                              )
                            }
                            className="counter-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="passenger-type">
                        <span>Infants (0-2)</span>
                        <div className="passenger-counter">
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "infants",
                                bookingData.passengers.infants - 1
                              )
                            }
                            disabled={bookingData.passengers.infants <= 0}
                            className="counter-btn"
                          >
                            -
                          </button>
                          <span className="counter-value">
                            {bookingData.passengers.infants}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handlePassengerChange(
                                "infants",
                                bookingData.passengers.infants + 1
                              )
                            }
                            className="counter-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="class-input-group">
                  <label className="input-label">Class</label>
                  <select
                    value={bookingData.class}
                    onChange={(e) => handleInputChange("class", e.target.value)}
                    className="class-select"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="search-btn"
              disabled={isSearching}
            >
              <div className="search-btn-content">
                <Search className="search-btn-icon" />
                <span>{isSearching ? "Searching..." : "Search Flights"}</span>
              </div>
              {isSearching && <div className="search-loading"></div>}
            </button>
          </div>

          {/* Popular Destinations */}
          {/* <div className="popular-destinations">
            <h3>Popular Destinations</h3>
            <div className="destinations-grid">
              {popularDestinations.map((dest, index) => (
                <button
                  key={index}
                  className="destination-card"
                  onClick={() =>
                    handleInputChange("to", `${dest.city} (${dest.code})`)
                  }
                >
                  <span className="destination-code">{dest.code}</span>
                  <span className="destination-city">{dest.city}</span>
                  <span className="destination-country">{dest.country}</span>
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Available Flights</h2>
              <button
                className="filters-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="filter-icon" />
                Filters
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="filters-panel">
                <div className="filters-content">
                  <h3>Filter Results</h3>
                  <div className="filter-groups">
                    <div className="filter-group">
                      <h4>Price Range</h4>
                      <div className="price-range">
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [0, parseInt(e.target.value)],
                            }))
                          }
                          className="price-slider"
                        />
                        <span className="price-value">
                          Up to ${filters.priceRange[1]}
                        </span>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h4>Airlines</h4>
                      {airlines.map((airline) => (
                        <label key={airline} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  airlines: [...prev.airlines, airline],
                                }));
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  airlines: prev.airlines.filter(
                                    (a) => a !== airline
                                  ),
                                }));
                              }
                            }}
                            className="checkbox-input"
                          />
                          <span className="checkbox-text">{airline}</span>
                        </label>
                      ))}
                    </div>

                    <div className="filter-group">
                      <h4>Stops</h4>
                      <div className="radio-group">
                        {["any", "nonstop", "1stop", "2plus"].map((option) => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name="stops"
                              value={option}
                              checked={filters.stops === option}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  stops: e.target.value,
                                }))
                              }
                              className="radio-input"
                            />
                            <span className="radio-text">
                              {option === "any" && "Any number of stops"}
                              {option === "nonstop" && "Nonstop only"}
                              {option === "1stop" && "1 stop or fewer"}
                              {option === "2plus" && "2+ stops"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flight Cards */}
            <div className="flights-list">
              {searchResults.map((flight) => (
                <div
                  key={flight.id}
                  className={`flight-card ${
                    selectedFlight?.id === flight.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedFlight(flight)}
                >
                  <div className="flight-header">
                    <div className="airline-info">
                      <span className="airline-logo">{flight.logo}</span>
                      <div className="airline-details">
                        <h4 className="airline-name">{flight.airline}</h4>
                        <span className="aircraft-type">{flight.aircraft}</span>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price">${flight.price}</span>
                      <span className="currency">/{flight.currency}</span>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="flight-route">
                      <div className="departure-info">
                        <span className="time">{flight.departure.time}</span>
                        <span className="airport">
                          {flight.departure.airport}
                        </span>
                        <span className="city">{flight.departure.city}</span>
                      </div>

                      <div className="flight-duration">
                        <div className="duration-line">
                          <div className="duration-dot"></div>
                          <div className="duration-bar"></div>
                          <div className="duration-dot"></div>
                        </div>
                        <span className="duration-text">{flight.duration}</span>
                        <span className="stops-text">
                          {flight.stops === 0
                            ? "Nonstop"
                            : `${flight.stops} stop${
                                flight.stops > 1 ? "s" : ""
                              }`}
                        </span>
                      </div>

                      <div className="arrival-info">
                        <span className="time">{flight.arrival.time}</span>
                        <span className="airport">
                          {flight.arrival.airport}
                        </span>
                        <span className="city">{flight.arrival.city}</span>
                      </div>
                    </div>

                    <div className="flight-amenities">
                      <div className="amenities-list">
                        {flight.amenities.map((amenity, index) => (
                          <div key={index} className="amenity-item">
                            {getAmenityIcon(amenity)}
                            <span className="amenity-text">{amenity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flight-meta">
                        <div className="rating">
                          <Star className="star-icon" />
                          <span>{flight.rating}</span>
                        </div>
                        <div className="baggage">
                          <Luggage className="baggage-icon" />
                          <span>{flight.baggage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flight-actions">
                    <button className="select-flight-btn">Select Flight</button>
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Flight Summary */}
        {selectedFlight && (
          <div className="selected-flight-summary">
            <div className="summary-header">
              <h3>Selected Flight</h3>
              <button
                className="close-summary"
                onClick={() => setSelectedFlight(null)}
              >
                <X />
              </button>
            </div>
            <div className="summary-content">
              <div className="summary-flight">
                <span className="summary-airline">
                  {selectedFlight.airline}
                </span>
                <span className="summary-route">
                  {selectedFlight.departure.airport} →{" "}
                  {selectedFlight.arrival.airport}
                </span>
                <span className="summary-price">${selectedFlight.price}</span>
              </div>
              <button className="proceed-btn">Proceed to Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightBooking;
