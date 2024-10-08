import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext'

const Timer = ({ bookId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const { user } = useContext(AuthContext);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startSession = async () => {
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookId, userId: user._id })
      });
      const data = await response.json();
      setSessionId(data._id);
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const stopSession = () => {
    setIsRunning(false);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await fetch(`${API_HOST}:${API_PORT}/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          endTime: new Date(), 
          duration: time,
          pagesRead,
          status: 'completed'
        })
      });
      setShowModal(false);
      setTime(0);
      setPagesRead(0);
      setSessionId(null);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="reading-timer d-flex justify-content-between align-items-center">
        <div className="timer-display">{formatTime(time)}</div>
        {!isRunning ? (
          <Button 
          onClick={startSession}
          className='accent-bg'
          >Start Session</Button>
        ) : (
          <Button 
          onClick={stopSession}
          className='bg-d border-0'>Stop Session</Button>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Session Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Pages Read</Form.Label>
              <Form.Control 
                type="number" 
                value={pagesRead} 
                onChange={(e) => setPagesRead(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Timer;