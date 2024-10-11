import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BookDetails.css'
import { Button } from 'react-bootstrap';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    cover: '',
    title: '',
    author: '',
    category: '',
    totalPages: 0,
    progress: 0,
    barcode: '',
    publisher: '',
    description: '',
    status: 'to_read',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const fetchBookDetails = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Authentication failed. Please log in.');
        return;
      }

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error retrieving book details');
        }
        const data = await response.json();
        setBookData(data);
      } catch (error) {
        console.error('Error retrieving book details:', error);
      }
    };

    const fetchCategories = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Authentication failed. Please log in.');
        return;
      }

      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/categories/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error retrieving categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error retrieving categories:', error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
    fetchCategories();
  }, [id, API_HOST, API_PORT]);

  const uploadCover = async () => {
    if (!selectedFile) return null;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cover', selectedFile);

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/upload-cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading cover');
      }

      const data = await response.json();
      return data.coverUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      return null;
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Authentication failed. Please log in.');
      return;
    }

    try {
      let categoryId = bookData.category;

      if (isCreatingCategory && newCategory) {
        categoryId = await createCategory(newCategory);

        if (!categoryId) {
          console.error('Error creating category.');
          return;
        }
      }

      const coverUrl = await uploadCover();

      const bookDetails = {
        ...bookData,
        cover: coverUrl || bookData.cover,
        category: categoryId,
        progress: parseInt(bookData.progress) || 0,
        totalPages: parseInt(bookData.totalPages) || 0, // Aggiunto totalPages
      };

      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `${API_HOST}:${API_PORT}/api/books/${id}`
        : `${API_HOST}:${API_PORT}/api/books/add`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookDetails),
      });

      if (!response.ok) {
        throw new Error('Error saving book');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const createCategory = async (name) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Authentication failed. Please log in.');
      return null;
    }

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Error creating category');
      }

      const data = await response.json();
      return data._id;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Authentication failed. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting book');
      }

      alert('Book successfully deleted!');

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="container mt-5 book-import-container">
      <h2>{id ? 'Edit book' : 'Add a new book'}</h2>
      <form>
        <div className="mb-2">
          <label htmlFor="cover" className="form-label">Upload Cover Image</label>
          <input
            id="cover"
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={bookData.title}
            onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
            placeholder="Title"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            id="author"
            type="text"
            className="form-control"
            value={bookData.author}
            onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
            placeholder="Author"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            className="form-select"
            value={bookData.category}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'create-new') {
                setIsCreatingCategory(true);
              } else {
                setBookData({ ...bookData, category: value });
                setIsCreatingCategory(false);
              }
            }}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
            <option value="create-new">Create a new category</option>
          </select>
        </div>

        {isCreatingCategory && (
          <div className="mb-2">
            <label htmlFor="new-category" className="form-label">New Category</label>
            <input
              id="new-category"
              type="text"
              className="form-control"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
            />
          </div>
        )}

        <div className="mb-2">
          <label htmlFor="totalPages" className="form-label">Total Pages</label>
          <input
            id="totalPages"
            type="number"
            className="form-control"
            value={bookData.totalPages}
            onChange={(e) => setBookData({ ...bookData, totalPages: parseInt(e.target.value) })}
            placeholder="Total pages"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="progress" className="form-label">Pages read</label>
          <input
            id="progress"
            type="number"
            className="form-control"
            value={bookData.progress}
            onChange={(e) => setBookData({ ...bookData, progress: parseInt(e.target.value) })}
            placeholder="Pages read"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={bookData.description}
            onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
            placeholder="Description"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            className="form-select"
            value={bookData.status}
            onChange={(e) => setBookData({ ...bookData, status: e.target.value })}
          >
            <option value="to_read">To Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Button type="button" className="accent-bg me-2" onClick={handleSave}>
          Save
        </Button>
        {id && (
          <Button type="button" className="bg-d" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </form>
    </div>
  );
};

export default BookDetails;