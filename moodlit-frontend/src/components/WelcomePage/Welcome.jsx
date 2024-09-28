import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { Row, Col, Container } from 'react-bootstrap'; // Se usi react-bootstrap
import './Welcome.css';
import AuthForm from '../Auth/AuthForm/AuthForm';

const Welcome = () => {
    const [showForm, setShowForm] = useState(false);
    const [formDisplay, setFormDisplay] = useState('none'); // Gestisce il display dinamico del form

    useEffect(() => {
        // Imposta un ritardo per mostrare il form di login dopo l'animazione di MoodLit
        const timer = setTimeout(() => {
            setShowForm(true);
            setFormDisplay('flex'); // Cambia il display in "flex" (o "block") al termine dell'animazione
        }, 12000); // 12 secondi di ritardo per sincronizzarlo con l'animazione di "MoodLit"
        
        return () => clearTimeout(timer); // Pulisce il timeout quando il componente viene smontato
    }, []);

    return (
        <Container fluid className='welcome-container text-main'>
            <Row>
                {/* Colonna di benvenuto, rimane visibile su desktop e tablet, nascosta su mobile quando appare il form */}
                <Col
                    xs={12}
                    lg={6}
                    className={`${showForm ? 'd-none d-lg-flex' : ''}`}
                    id='welcome-column' // Nasconde la colonna su mobile quando il form è visibile
                >
                    <p>Hello,
                        <Typewriter
                            words={[' reader', ' student', ' learner']}
                            loop={1}
                            cursor
                            cursorStyle="|"
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1000}
                        />
                    </p>

                    {/* Motion per "Welcome to" */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 6.5, duration: 1 }}
                    >
                        Welcome to
                    </motion.p>

                    {/* Motion per "MoodLit" */}
                    <motion.h1
                        className='title-font'
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 7.5, duration: 1 }}
                    >
                        MoodLit
                    </motion.h1>
                </Col>

                {/* Colonna per il form di login/registrazione, usa style inline per controllare il display */}
                <Col xs={12} lg={6} id='form-column' style={{ display: formDisplay }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} // Form inizialmente invisibile
                        animate={{ opacity: 1, y: 0 }} // Appare quando MoodLit finisce di caricare
                        transition={{ delay: 12, duration: 2 }} // Appare dopo MoodLit
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
