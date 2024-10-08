import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../../context/AuthContext';

const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const ReadingStats = () => {
  const [stats, setStats] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/sessions/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        // Calcola i valori cumulativi
        let cumulativePages = 0;
        let cumulativeTime = 0;
        const processedData = data.map(item => ({
          ...item,
          cumulativePages: (cumulativePages += item.pagesRead),
          cumulativeTime: (cumulativeTime += item.timeRead)
        }));
        setStats(processedData);
      } catch (error) {
        console.error('Error fetching reading stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!stats.length) {
    return <Card className="reading-stats glass-bg"><Card.Body>No reading stats available yet.</Card.Body></Card>;
  }

  return (
    <Card className="reading-stats glass-bg mt-3">
      <Card.Body>
        <Card.Title>Reading Progress Overview</Card.Title>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={stats}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="pagesRead" fill="#8884d8" name="Daily Pages Read" />
            <Bar yAxisId="right" dataKey="timeRead" fill="#82ca9d" name="Daily Time Read (minutes)" />
            <Line yAxisId="left" type="monotone" dataKey="cumulativePages" stroke="#ff7300" name="Cumulative Pages Read" />
            <Area yAxisId="right" type="monotone" dataKey="cumulativeTime" fill="#ffc658" stroke="#ffc658" name="Cumulative Time Read (minutes)" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default ReadingStats;