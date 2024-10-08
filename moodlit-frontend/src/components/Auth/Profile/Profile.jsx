import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
      name: '',
      email: '',
      avatar: '',
    });
    const [password, setPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const API_HOST = process.env.REACT_APP_API_HOST;
    const API_PORT = process.env.REACT_APP_API_PORT;

    // UseEffect per il recupero dell'utente
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          setError('Autenticazione fallita. Per favore, accedi.');
          return;
        }
    
        try {
          const response = await fetch(`${API_HOST}:${API_PORT}/api/users/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Errore nel recupero dei dati utente');
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          setError('Errore nel recupero dei dati utente: ' + error.message);
        }
      }, [API_HOST, API_PORT]); // Dipendenze dell'API
    
      useEffect(() => {
        fetchUser();
      }, [fetchUser]);
    

    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(userData.avatar || '');
      }
    }, [selectedFile, userData.avatar]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
    };

    const uploadAvatar = async () => {
      if (!selectedFile) return null;
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/users/uploadAvatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Errore nel caricamento dell\'avatar');
        }

        const data = await response.json();
        return data.avatarUrl;
      } catch (error) {
        setError('Errore durante il caricamento dell\'avatar: ' + error.message);
        return null;
      }
    };

    const handleSave = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Autenticazione fallita. Per favore, accedi.');
        return;
      }

      try {
        const avatarUrl = await uploadAvatar();
        if (avatarUrl === null && selectedFile) return; // Se c'è stato un errore, interrompi il processo

        const userDetails = {
          ...userData,
          avatar: avatarUrl || userData.avatar,
          password: password || undefined,
        };

        const response = await fetch(`${API_HOST}:${API_PORT}/api/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userDetails),
        });

        if (!response.ok) {
          throw new Error('Errore durante l\'aggiornamento del profilo');
        }

        setSuccess('Profilo aggiornato con successo.');
        fetchUser();
        setSelectedFile(null); // Reimposta selectedFile a null dopo il caricamento
      } catch (error) {
        setError('Errore durante l\'aggiornamento del profilo: ' + error.message);
      }
    };

    const handleDeleteAccount = async () => {
      if (window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.')) {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Autenticazione fallita. Per favore, accedi.');
          return;
        }

        try {
          const response = await fetch(`${API_HOST}:${API_PORT}/api/users/profile`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Errore durante l\'eliminazione dell\'account');
          }

          localStorage.removeItem('token');
          navigate('/login');
        } catch (error) {
          setError('Errore durante l\'eliminazione dell\'account: ' + error.message);
        }
      }
    };

    return (
      <Container className="mt-5 profile-container">
        <h2 className="mb-4 text-center">Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSave}>
          <div className="text-center mb-3">
            <Image 
              src={previewUrl || 'https://via.placeholder.com/150'} 
              roundedCircle 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="avatar">Upload Avatar</Form.Label>
            <Form.Control
              id="avatar"
              type="file"
              className='m-0'
              onChange={handleFileChange}
              accept="image/*"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control
              id="name"
              type="text"
              name="name"
              className='m-0'
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              id="email"
              type="email"
              name="email"
              className='m-0'
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">New Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={password}
              className='m-0'
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set new Password"
            />
          </Form.Group>

          <Button type="submit" className="accent-bg me-2">
            Save
          </Button>
          <Button className='bg-d border-none' onClick={handleDeleteAccount}>
            Detele Account
          </Button>
        </Form>
      </Container>
    );
};

export default Profile;
