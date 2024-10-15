import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Button, Alert, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { AuthContext } from '../../../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
    const API_URL = process.env.REACT_APP_API_URL

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          setError('Authentication failed. Please log in.');
          return;
        }
    
        try {
          const response = await fetch(`${API_URL}/api/users/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Error retrieving user data');
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          setError('Error retrieving user data: ' + error.message);
        }
      }, [API_URL]);
    
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
        const response = await fetch(`${API_URL}/api/users/uploadAvatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error uploading avatar');
        }

        const data = await response.json();
        return data.avatarUrl;
      } catch (error) {
        setError('Error uploading avatar: ' + error.message);
        return null;
      }
    };

    const handleSave = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication failed. Please log in.');
        return;
      }

      try {
        const avatarUrl = await uploadAvatar();
        if (avatarUrl === null && selectedFile) return;

        const userDetails = {
          ...userData,
          avatar: avatarUrl || userData.avatar,
          password: password || undefined,
        };

        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userDetails),
        });

        if (!response.ok) {
          throw new Error('Error updating profile');
        }

        setSuccess('Profile updated successfully.');
        fetchUser();
        setSelectedFile(null);
      } catch (error) {
        setError('Error updating profile: ' + error.message);
      }
    };

    const handleDeleteAccount = async () => {
      const token = localStorage.getItem('token');
    
      if (!token) {
        setError('Authentication failed. Please log in.');
        return;
      }
    
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Error deleting account');
        }
            await logout();
    
        navigate('/');
      } catch (error) {
        setError('Error deleting account: ' + error.message);
      }
    };
    

    return (
      <Container className="mt-5 profile-container">
        <h2 className="mb-4 text-center">Profile</h2>
        {error && <Alert className='bg-d p-2 text-center'>{error}</Alert>}
        {success && <Alert className='accent-bg p-2 text-center'>{success}</Alert>}
        <Form onSubmit={handleSave}>
          <div className="text-center my-3">
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
          <Button className='bg-d border-none' onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </Form>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Account Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete your account? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button className="accent-bg" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button className='bg-d' onClick={() => {
              setShowDeleteModal(false);
              handleDeleteAccount();
            }}>
              Delete Account
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
};

export default Profile;