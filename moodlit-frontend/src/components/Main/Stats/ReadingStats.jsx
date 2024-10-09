import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../../context/AuthContext';

const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const ReadingStats = () => {
  const [stats, setStats] = useState([]);
  const [aggregateStats, setAggregateStats] = useState({});
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
        
        let cumulativePages = 0;
        let cumulativeTime = 0;
        const processedData = data.map(item => ({
          ...item,
          cumulativePages: (cumulativePages += item.pagesRead),
          cumulativeTime: (cumulativeTime += item.timeRead)
        }));
        
        setStats(processedData);
        calculateAggregateStats(processedData);
      } catch (error) {
        console.error('Error fetching reading stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const calculateAggregateStats = (data) => {
    const totalPages = data.reduce((sum, item) => sum + item.pagesRead, 0);
    const totalTime = data.reduce((sum, item) => sum + item.timeRead, 0);
    const totalDays = data.length;
    const maxPagesDay = data.reduce((max, item) => item.pagesRead > max.pages ? { date: item.date, pages: item.pagesRead } : max, { pages: 0 });

    setAggregateStats({
      totalPages,
      totalTime,
      avgPagesPerHour: totalTime > 0 ? (totalPages / (totalTime / 60)).toFixed(2) : 0,
      avgPagesPerDay: totalDays > 0 ? (totalPages / totalDays).toFixed(2) : 0,
      avgTimePerDay: totalDays > 0 ? (totalTime / totalDays).toFixed(2) : 0,
      maxReadingDay: maxPagesDay.date,
      maxReadingPages: maxPagesDay.pages
    });
  };

  if (!stats.length) {
    return <Card className="reading-stats glass-bg mt-3"><Card.Body>No reading stats available yet.</Card.Body></Card>;
  }

  return (
    <Card className="reading-stats glass-bg mt-3">
      <Card.Body>
        <Card.Title>Reading Progress Overview</Card.Title>
        
        <div className="aggregate-stats mb-4">
          <h5>Summary Statistics</h5>
          <p>Total Pages Read: {aggregateStats.totalPages}</p>
          <p>Total Reading Time: {aggregateStats.totalTime} minutes</p>
          <p>Average Pages per Hour: {aggregateStats.avgPagesPerHour}</p>
          <p>Average Pages per Day: {aggregateStats.avgPagesPerDay}</p>
          <p>Average Reading Time per Day: {aggregateStats.avgTimePerDay} minutes</p>
          <p>Most Productive Day: {aggregateStats.maxReadingDay} ({aggregateStats.maxReadingPages} pages)</p>
        </div>
        
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