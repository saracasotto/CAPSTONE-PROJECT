import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { Row, Col, Container } from 'react-bootstrap'; 
import './Welcome.css';
import AuthForm from '../Auth/AuthForm/AuthForm';

const Welcome = () => {
    const { user } = useContext(AuthContext); 
    const [showForm, setShowForm] = useState(false);
    const [formDisplay, setFormDisplay] = useState('none'); 
    const navigate = useNavigate(); 
    const location = useLocation();
    
  
    useEffect(() => {
      if (user && location.pathname === '/') {
        navigate('/mood-selection');
      } else {
     
        const timer = setTimeout(() => {
          setShowForm(true);
          setFormDisplay('flex'); 
        }, 10000); 
        
        return () => clearTimeout(timer); 
      }
    }, [user, navigate, location.pathname]); 
  
    return (
      <Container fluid className='welcome-container text-l'>
        <Row>
          <Col
            xs={12}
            lg={6}
            className={`${showForm ? 'd-none d-lg-flex' : ''}`}
            id='welcome-column' 
          >
            <p>Hello,
              <Typewriter
                words={[' reader', ' student', ' learner']}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={900}
              />
            </p>
  

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6.5, duration: 1 }}
            >
              Welcome to
            </motion.p>
  

            <motion.h1
              className='title-font'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7.5, duration: 1 }}
            >
              MoodLit
            </motion.h1>
          </Col>
  

          <Col xs={12} lg={6} id='form-column' style={{ display: formDisplay }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 10, duration: 2 }} 
            >
              {showForm && (
                <AuthForm />
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default Welcome;
