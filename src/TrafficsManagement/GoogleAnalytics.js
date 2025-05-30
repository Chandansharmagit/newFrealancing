import React, { useState, useEffect, useCallback } from 'react';
import './GoogleAnalytics.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const GoogleAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [countriesData, setCountriesData] = useState(null);
  const [pagesData, setPagesData] = useState(null);
  const [trafficSourcesData, setTrafficSourcesData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('7d');

  // Map dateRange to startDate and endDate
  const getDateRangeParams = useCallback(() => {
    const endDate = new Date().toISOString().split('T')[0]; // Today
    const startDateMap = {
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      '90d': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    return { startDate: startDateMap[dateRange], endDate };
  }, [dateRange]);

  const fetchAnalyticsData = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    const { startDate, endDate } = getDateRangeParams();

    try {
      // Fetch /analytics
      const analyticsResponse = await fetch('https://googleanalyticsdashboardbackend-1.onrender.com/analytics');
      if (!analyticsResponse.ok) throw new Error(`Analytics HTTP error: ${analyticsResponse.status}`);
      const analyticsData = await analyticsResponse.json();
      setAnalyticsData(analyticsData);

      // Fetch /analytics/countries
      const countriesResponse = await fetch(
        `https://googleanalyticsdashboardbackend-1.onrender.com/analytics/countries?startDate=${startDate}&endDate=${endDate}`
      );
      if (!countriesResponse.ok) throw new Error(`Countries HTTP error: ${countriesResponse.status}`);
      const countriesData = await countriesResponse.json();
      setCountriesData(countriesData);

      // Fetch /analytics/pages
      const pagesResponse = await fetch(
        `https://googleanalyticsdashboardbackend-1.onrender.com/analytics/pages?startDate=${startDate}&endDate=${endDate}`
      );
      if (!pagesResponse.ok) throw new Error(`Pages HTTP error: ${pagesResponse.status}`);
      const pagesData = await pagesResponse.json();
      setPagesData(pagesData);

      // Fetch /analytics/traffic-sources
      const trafficSourcesResponse = await fetch(
        `https://googleanalyticsdashboardbackend-1.onrender.com/analytics/traffic-sources?startDate=${startDate}&endDate=${endDate}`
      );
      if (!trafficSourcesResponse.ok) throw new Error(`Traffic Sources HTTP error: ${trafficSourcesResponse.status}`);
      const trafficSourcesData = await trafficSourcesResponse.json();
      setTrafficSourcesData(trafficSourcesData);

      // Fetch /analytics/events
      const eventsResponse = await fetch(
        `https://googleanalyticsdashboardbackend-1.onrender.com/analytics/events?startDate=${startDate}&endDate=${endDate}`
      );
      if (!eventsResponse.ok) throw new Error(`Events HTTP error: ${eventsResponse.status}`);
      const eventsData = await eventsResponse.json();
      setEventsData(eventsData);

      // Fetch /analytics/realtime
      const realtimeResponse = await fetch('https://googleanalyticsdashboardbackend-1.onrender.com/analytics/realtime');
      if (!realtimeResponse.ok) throw new Error(`Realtime HTTP error: ${realtimeResponse.status}`);
      const realtimeData = await realtimeResponse.json();
      setRealtimeData(realtimeData);
    } catch (err) {
      setError(`Failed to fetch analytics data: ${err.message}`);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getDateRangeParams]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-wrapper">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h3 className="loading-title">Loading Analytics Dashboard</h3>
          <p className="loading-subtitle">Fetching your latest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-wrapper">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" />
              <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="error-title">Connection Failed</h3>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchAnalyticsData}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Process analytics data
  const processedAnalyticsData = analyticsData?.rows?.map((row, index) => ({
    day: `Day ${index + 1}`,
    activeUsers: parseInt(row.metricValues[0]?.value || 0),
    sessions: parseInt(row.metricValues[1]?.value || 0),
  })) || [];

  const totalUsers = processedAnalyticsData.reduce((sum, day) => sum + day.activeUsers, 0);
  const totalSessions = processedAnalyticsData.reduce((sum, day) => sum + day.sessions, 0);
  const avgUsers = Math.round(totalUsers / (processedAnalyticsData.length || 1));
  const avgSessions = Math.round(totalSessions / (processedAnalyticsData.length || 1));

  const userGrowth =
    processedAnalyticsData.length > 1
      ? (
          ((processedAnalyticsData[processedAnalyticsData.length - 1].activeUsers -
            processedAnalyticsData[0].activeUsers) /
            processedAnalyticsData[0].activeUsers) *
          100
        ).toFixed(1)
      : 0;

  const sessionGrowth =
    processedAnalyticsData.length > 1
      ? (
          ((processedAnalyticsData[processedAnalyticsData.length - 1].sessions -
            processedAnalyticsData[0].sessions) /
            processedAnalyticsData[0].sessions) *
          100
        ).toFixed(1)
      : 0;

  // Process countries data
  const processedCountriesData = countriesData?.rows?.slice(0, 10) || []; // Top 10 countries

  // Process pages data
  const processedPagesData = pagesData?.rows?.slice(0, 10) || []; // Top 10 pages

  // Process traffic sources data
  const processedTrafficSourcesData = trafficSourcesData?.rows || [];

  // Process events data
  const processedEventsData = eventsData?.rows?.slice(0, 10) || []; // Top 10 events

  // Process realtime data
  const processedRealtimeData = realtimeData?.rows?.slice(0, 5) || []; // Top 5 cities

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            size: 12,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          color: '#6b7280',
        },
      },
    },
  };

  const barChartData = {
    labels: processedAnalyticsData.map((item) => item.day),
    datasets: [
      {
        label: 'Active Users',
        data: processedAnalyticsData.map((item) => item.activeUsers),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Sessions',
        data: processedAnalyticsData.map((item) => item.sessions),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const lineChartData = {
    labels: processedAnalyticsData.map((item) => item.day),
    datasets: [
      {
        label: 'Active Users Trend',
        data: processedAnalyticsData.map((item) => item.activeUsers),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const countriesChartData = {
    labels: processedCountriesData.map((item) => item.country),
    datasets: [
      {
        label: 'Page Views',
        data: processedCountriesData.map((item) => item.pageViews),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const pagesChartData = {
    labels: processedPagesData.map((item) => item.pagePath),
    datasets: [
      {
        label: 'Page Views',
        data: processedPagesData.map((item) => item.pageViews),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const trafficSourcesChartData = {
    labels: processedTrafficSourcesData.map((item) => item.channel),
    datasets: [
      {
        data: processedTrafficSourcesData.map((item) => item.sessions),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  const eventsChartData = {
    labels: processedEventsData.map((item) => item.eventName),
    datasets: [
      {
        label: 'Event Count',
        data: processedEventsData.map((item) => item.eventCount),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <p className="dashboard-subtitle">Real-time insights and performance metrics</p>
          </div>
          <div className="header-actions">
            <div className="date-selector">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="date-select"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2" />
              </svg>
              {refreshing ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{totalUsers.toLocaleString()}</h3>
            <p className="stat-label">Total Users</p>
            <div className={`stat-change ${userGrowth >= 0 ? 'positive' : 'negative'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d={userGrowth >= 0 ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {Math.abs(userGrowth)}%
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sessions-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z" stroke="currentColor" strokeWidth="2" />
              <path d="M17.6 17.6L21 21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{totalSessions.toLocaleString()}</h3>
            <p className="stat-label">Total Sessions</p>
            <div className={`stat-change ${sessionGrowth >= 0 ? 'positive' : 'negative'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d={sessionGrowth >= 0 ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {Math.abs(sessionGrowth)}%
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon avg-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{avgUsers}</h3>
            <p className="stat-label">Avg. Daily Users</p>
            <div className="stat-change neutral">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" />
              </svg>
              Stable
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon conversion-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{avgSessions}</h3>
            <p className="stat-label">Avg. Daily Sessions</p>
            <div className="stat-change positive">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" />
              </svg>
              2.4%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">User Activity Overview</h3>
              <p className="chart-subtitle">Daily active users and sessions comparison</p>
            </div>
            <div className="chart-wrapper">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Traffic Sources</h3>
              <p className="chart-subtitle">User acquisition breakdown</p>
            </div>
            <div className="chart-wrapper doughnut-wrapper">
              <Doughnut
                data={trafficSourcesChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          family: "'Inter', sans-serif",
                          size: 11,
                        },
                        padding: 15,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Page Views by Country</h3>
              <p className="chart-subtitle">Top countries by page views</p>
            </div>
            <div className="chart-wrapper">
              <Bar data={countriesChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Top Pages</h3>
              <p className="chart-subtitle">Most viewed pages</p>
            </div>
            <div className="chart-wrapper">
              <Bar data={pagesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-header">
            <h3 className="chart-title">Event Counts</h3>
            <p className="chart-subtitle">Top events by count</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={eventsChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-header">
            <h3 className="chart-title">Real-Time Active Users</h3>
            <p className="chart-subtitle">Current users by city</p>
          </div>
          <div className="realtime-table">
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Active Users</th>
                </tr>
              </thead>
              <tbody>
                {processedRealtimeData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.city}</td>
                    <td>{item.activeUsers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-header">
            <h3 className="chart-title">User Trend Analysis</h3>
            <p className="chart-subtitle">Active users trend over selected period</p>
          </div>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalytics;