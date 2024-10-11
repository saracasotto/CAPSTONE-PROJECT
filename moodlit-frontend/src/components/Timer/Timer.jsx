import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext'

const Timer = ({ bookId, onSessionComplete  }) => {
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
      const sessionResponse = await fetch(`${API_HOST}:${API_PORT}/api/sessions/${sessionId}`, {
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

      if (!sessionResponse.ok) {
        throw new Error('Failed to update session');
      }

      // Retrieve current book data
      const bookGetResponse = await fetch(`${API_HOST}:${API_PORT}/api/books/${bookId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!bookGetResponse.ok) {
        throw new Error('Failed to get book data');
      }

      const bookData = await bookGetResponse.json();

      // Calculate new progress
      const newProgress = bookData.progress + pagesRead;

      // Update the book
      const bookUpdateResponse = await fetch(`${API_HOST}:${API_PORT}/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          progress: newProgress,
          status: newProgress > 0 ? 'reading' : 'to_read'
        })
      });

      if (!bookUpdateResponse.ok) {
        throw new Error('Failed to update book');
      }

      setShowModal(false);
      setTime(0);
      setPagesRead(0);
      setSessionId(null);

      if (onSessionComplete) {
        onSessionComplete();
      }
    } catch (error) {
      console.error('Error updating session and book:', error);
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
          size='sm'
          >Start Session</Button>
        ) : (
          <Button
          size="sm"
          onClick={stopSession}
          className='bg-d border-0'>Stop Session</Button>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header 
        className='bg-l'
        closeButton>
          <Modal.Title>Session Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Pages Read</Form.Label>
              <Form.Control 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*"
                value={pagesRead} 
                onChange={(e) => setPagesRead(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-d' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className='accent-bg' onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Timer;