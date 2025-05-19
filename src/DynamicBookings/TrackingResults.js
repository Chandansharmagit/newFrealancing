import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatDate } from './utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrackingResults = ({ activeTab, userTracking, tourTracking, combinedTracking, allToursUsers }) => {
  const getPieChartData = () => {
    if (activeTab === 'user' && userTracking) {
      const labels = userTracking.summary.tourInteractions.map(tour => tour._id);
      const data = userTracking.summary.tourInteractions.map(tour => tour.count);
      return {
        labels,
        datasets: [{
          label: 'Interactions per Tour',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
      };
    }
    if (activeTab === 'tour' && tourTracking) {
      const labels = tourTracking.summary.userInteractions.map(user => user._id);
      const data = tourTracking.summary.userInteractions.map(user => user.count);
      return {
        labels,
        datasets: [{
          label: 'Interactions per User',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
      };
    }
    if (activeTab === 'combined' && combinedTracking) {
      const labels = Object.keys(combinedTracking.stats.sources);
      const data = Object.values(combinedTracking.stats.sources);
      return {
        labels,
        datasets: [{
          label: 'Interactions by Source',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }],
      };
    }
    if (activeTab === 'all' && allToursUsers) {
      return {
        labels: ['Total Tours', 'Total Users'],
        datasets: [{
          label: 'Tours vs Users',
          data: [allToursUsers.totalTours, allToursUsers.totalUsers],
          backgroundColor: ['#FF6384', '#36A2EB'],
        }],
      };
    }
    return null;
  };

  return (
    <div className="tracking-results">
      {activeTab === 'user' && userTracking && (
        <div className="user-tracking">
          <h2>User Tracking Data</h2>
          <div className="summary-card">
            <h3>Summary</h3>
            <p>Total Interactions: {userTracking.summary.totalInteractions}</p>
            <p>Tours Interacted With: {userTracking.summary.tourInteractions.length}</p>
            {userTracking.userDetails && (
              <>
                <p><strong>User Name:</strong> {userTracking.userDetails.name || 'N/A'}</p>
                <p><strong>Email:</strong> {userTracking.userDetails.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {userTracking.userDetails.phone || 'N/A'}</p>
                <p><strong>Description:</strong> {userTracking.userDetails.description || 'N/A'}</p>
              </>
            )}
          </div>
          <div className="pie-chart">
            <Pie data={getPieChartData()} />
          </div>
          <h3>Tour Interactions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tour ID</th>
                <th>Interactions</th>
                <th>First Interaction</th>
                <th>Last Interaction</th>
                {userTracking.userDetails && (
                  <>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Description</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {userTracking.summary.tourInteractions.map(tour => (
                <tr key={tour._id}>
                  <td>{tour._id}</td>
                  <td>{tour.count}</td>
                  <td>{formatDate(tour.firstInteraction)}</td>
                  <td>{formatDate(tour.lastInteraction)}</td>
                  {userTracking.userDetails && (
                    <>
                      <td>{userTracking.userDetails.name || 'N/A'}</td>
                      <td>{userTracking.userDetails.email || 'N/A'}</td>
                      <td>{userTracking.userDetails.phone || 'N/A'}</td>
                      <td>{userTracking.userDetails.description || 'N/A'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Recent Interactions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tour ID</th>
                <th>Source</th>
                {userTracking.userDetails && (
                  <>
                    <th>User Name</th>
                    <th>Email</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {userTracking.interactions.map((interaction, index) => (
                <tr key={index}>
                  <td>{formatDate(interaction.timestamp)}</td>
                  <td>{interaction.tourId}</td>
                  <td>{interaction.source}</td>
                  {userTracking.userDetails && (
                    <>
                      <td>{userTracking.userDetails.name || 'N/A'}</td>
                      <td>{userTracking.userDetails.email || 'N/A'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'tour' && tourTracking && (
        <div className="tour-tracking">
          <h2>Tour Tracking Data</h2>
          <div className="summary-card">
            <h3>Summary</h3>
            <p>Total Interactions: {tourTracking.summary.totalInteractions}</p>
            <p>Unique Users: {tourTracking.summary.uniqueUsers}</p>
          </div>
          <div className="pie-chart">
            <Pie data={getPieChartData()} />
          </div>
          <h3>User Interactions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Interactions</th>
                <th>First Interaction</th>
                <th>Last Interaction</th>
              </tr>
            </thead>
            <tbody>
              {tourTracking.summary.userInteractions.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.count}</td>
                  <td>{formatDate(user.firstInteraction)}</td>
                  <td>{formatDate(user.lastInteraction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Daily Interactions</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Interactions</th>
              </tr>
            </thead>
            <tbody>
              {tourTracking.summary.dailyInteractions.map(day => (
                <tr key={day._id}>
                  <td>{day._id}</td>
                  <td>{day.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'combined' && combinedTracking && (
        <div className="combined-tracking">
          <h2>User-Tour Interaction Data</h2>
          <div className="summary-card">
            <h3>Summary</h3>
            <p>Total Interactions: {combinedTracking.stats.totalCount}</p>
            <p>First Interaction: {formatDate(combinedTracking.stats.firstInteraction)}</p>
            <p>Last Interaction: {formatDate(combinedTracking.stats.lastInteraction)}</p>
          </div>
          <div className="pie-chart">
            <Pie data={getPieChartData()} />
          </div>
          <h3>Interaction Sources</h3>
          <ul className="source-list">
            {Object.entries(combinedTracking.stats.sources).map(([source, count]) => (
              <li key={source}>
                <strong>{source}:</strong> {count} interactions
              </li>
            ))}
          </ul>
          <h3>Interaction History</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sourcebirds</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {combinedTracking.interactions.map((interaction, index) => (
                <tr key={index}>
                  <td>{formatDate(interaction.timestamp)}</td>
                  <td>{interaction.source}</td>
                  <td className="user-agent">{interaction.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'all' && allToursUsers && (
        <div className="all-tours-users">
          <h2>All Tours and Users (Newest First)</h2>
          <div className="summary-card">
            <h3>Summary</h3>
            <p>Total Tours: {allToursUsers.totalTours}</p>
            <p>Total Users: {allToursUsers.totalUsers}</p>
          </div>
          <div className="pie-chart">
            <Pie data={getPieChartData()} />
          </div>
          <h3>Tours</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tour ID</th>
                <th>Tour Name</th>
                <th>Description</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tour.tourId}</td>
                <td>{tour.details?.name || 'N/A'}</td>
                <td>{tour.details?.description || 'No details available'}</td>
                <td>{tour.addedOn}</td>
              </tr>
            </tbody>
          </table>
          <h3>Users</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {allToursUsers.users.map((user, index) => (
                <tr key={index}>
                  <td>{user.userId}</td>
                  <td>{user.addedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackingResults;