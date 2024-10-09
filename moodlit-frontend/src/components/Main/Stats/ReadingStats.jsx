import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, Button, Modal, Alert } from 'react-bootstrap';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../../context/AuthContext';

const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const ReadingStats = () => {
  const [stats, setStats] = useState([]);
  const [aggregateStats, setAggregateStats] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

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

  const handleResetStats = async () => {
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/sessions/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setStats([]);
        setAggregateStats({});
        setShowResetModal(false);
        setShowResetAlert(true);
        setTimeout(() => setShowResetAlert(false), 2000);
      } else {
        throw new Error('Failed to reset stats');
      }
    } catch (error) {
      console.error('Error resetting stats:', error);
      // Here you might want to show an error message to the user
    }
  };

  if (!stats.length) {
    return (
      <Card className="reading-stats glass-bg mt-3">
        <Card.Body>
          {showResetAlert && (
            <Alert className='accent-bg p-1' onClose={() => setShowResetAlert(false)}>
              Reading statistics have been successfully reset.
            </Alert>
          )}
          <p>No reading stats available yet.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="reading-stats glass-bg mt-3">
      <Card.Body>
        {showResetAlert && (
          <Alert variant="success" onClose={() => setShowResetAlert(false)} dismissible>
            Reading statistics have been successfully reset.
          </Alert>
        )}
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

        <Button className="mt-3 accent-bg" onClick={() => setShowResetModal(true)}>
          Reset All Stats
        </Button>

        <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reset</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to reset all reading statistics? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="accent-bg" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button className='bg-d' onClick={handleResetStats}>
              Reset Stats
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default ReadingStats;