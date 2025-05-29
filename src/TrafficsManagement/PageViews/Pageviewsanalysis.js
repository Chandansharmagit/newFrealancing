import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import './Pageviewsanalysis.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Pageviewsanalysis = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analytics/countries');
        const data = response.data;

        const countries = data.rows.map(row => row.country);
        const pageViews = data.rows.map(row => row.pageViews);

        setChartData({
          labels: countries,
          datasets: [
            {
              label: 'Page Views',
              data: pageViews,
              backgroundColor: '#007bff',
              borderColor: '#0056b3',
              borderWidth: 1,
              hoverBackgroundColor: '#3399ff',
              hoverBorderColor: '#003d80',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchPageViews();
  }, []);

  return (
    <div className="pageviews-container">
      <div className="pageviews-card">
        <h2 className="pageviews-heading">🌍 Page Views by Country</h2>
        {loading ? (
          <p className="pageviews-loading">Loading data...</p>
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: '#333',
                    font: {
                      size: 14,
                      weight: 'bold',
                    },
                  },
                },
                title: {
                  display: true,
                  text: 'Page View Statistics by Country',
                  font: {
                    size: 18,
                    weight: 'bold',
                  },
                  color: '#111',
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: '#444',
                    font: {
                      size: 12,
                    },
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#444',
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p className="pageviews-nodata">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Pageviewsanalysis;
