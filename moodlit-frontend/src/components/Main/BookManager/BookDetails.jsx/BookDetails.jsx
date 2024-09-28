import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();  
  const navigate = useNavigate();

  // Stato per i dati del libro
  const [bookData, setBookData] = useState({
    cover: '',  // URL dell'immagine
    title: '',
    author: '',
    category: '',
    progress: 0,
    barcode: '',
    publisher: '',
    description: '',
    status: 'to_read', 
  });

  const [selectedFile, setSelectedFile] = useState(null); // Stato per l'immagine selezionata
  const [categories, setCategories] = useState([]);  // Stato per le categorie esistenti
  const [newCategory, setNewCategory] = useState('');  // Stato per una nuova categoria
  const [isCreatingCategory, setIsCreatingCategory] = useState(false); // Per mostrare il campo per la nuova categoria

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  // Carica i dettagli del libro se esiste (per la modifica)
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/books/getWithoutAuth/${id}`);
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dettagli del libro');
        }
        const data = await response.json();
        setBookData(data);
      } catch (error) {
        console.error('Errore nel recupero dei dettagli del libro:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_HOST}:${API_PORT}/api/categories`);
        if (!response.ok) {
          throw new Error('Errore nel recupero delle categorie');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Errore nel recupero delle categorie:', error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
    fetchCategories();
  }, [id, API_HOST, API_PORT]);  

  // Funzione per caricare l'immagine
  const uploadImage = async () => {
    if (!selectedFile) return null;  // Se non c'è immagine, ritorna null

    const formData = new FormData();
    formData.append('cover', selectedFile);

    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/upload-cover`, {  // URL per l'upload dell'immagine
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dell\'immagine');
      }

      const data = await response.json();
      return data.imageUrl;  // Restituisce l'URL dell'immagine caricata
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
      return null;
    }
  };

  // Funzione per gestire il salvataggio del libro
  const handleSave = async () => {
    try {
      let categoryId = bookData.category;

      // Se stiamo creando una nuova categoria, la creiamo e otteniamo il suo ID
      if (isCreatingCategory && newCategory) {
        categoryId = await createCategory(newCategory);
      }

      // Carica prima l'immagine se è stata selezionata
      const coverUrl = await uploadImage();

      const bookDetails = {
        ...bookData,
        cover: coverUrl || bookData.cover,  // Usa l'URL dell'immagine appena caricata o quello esistente
        category: categoryId, // Usa l'ID della categoria selezionata o creata
      };

      const method = id ? 'PUT' : 'POST';  // PUT per modifica, POST per aggiunta
      const url = id 
        ? `${API_HOST}:${API_PORT}/api/books/updateWithoutAuth/${id}` 
        : `${API_HOST}:${API_PORT}/api/books/addWithoutAuth`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookDetails),  // Invia i dati del libro come JSON
      });

      if (!response.ok) {
        throw new Error('Errore durante il salvataggio del libro');
      }

      navigate('/books');  
    } catch (error) {
      console.error('Errore durante il salvataggio del libro:', error);
    }
  };

  // Funzione per creare una nuova categoria
  const createCategory = async (name) => {
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Errore nella creazione della categoria');
      }

      const data = await response.json();
      return data._id;  // Restituisce l'ID della nuova categoria
    } catch (error) {
      console.error('Errore nella creazione della categoria:', error);
      return null;
    }
  };

  // Funzione per gestire l'input del file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Prendiamo il file selezionato
  };

  // Funzione per gestire l'eliminazione del libro
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione del libro');
      }

      navigate('/books'); 
    } catch (error) {
      console.error('Errore durante l\'eliminazione del libro:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>
      <form>
        {/* Campo per il caricamento dell'immagine */}
        <div className="mb-3">
          <label htmlFor="cover" className="form-label">Upload Cover Image</label>
          <input
            id="cover"
            type="file"
            className="form-control"
            onChange={handleFileChange}  // Gestione del cambio file
          />
        </div>

        {/* Campo per il titolo */}
        <div className="mb-3">
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

        {/* Campo per l'autore */}
        <div className="mb-3">
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

        {/* Selezione o creazione della categoria */}
        <div className="mb-3">
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
                setIsCreatingCategory(false); // Nascondi il campo per la nuova categoria
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

        {/* Campo per la creazione di una nuova categoria */}
        {isCreatingCategory && (
          <div className="mb-3">
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

        {/* Campo per il progresso di lettura */}
        <div className="mb-3">
          <label htmlFor="progress" className="form-label">Progress</label>
          <input
            id="progress"
            type="number"
            className="form-control"
            value={bookData.progress}
            onChange={(e) => setBookData({ ...bookData, progress: e.target.value })}
            placeholder="Progress (%)"
          />
        </div>

        {/* Campo per il codice a barre */}
        <div className="mb-3">
          <label htmlFor="barcode" className="form-label">Barcode</label>
          <input
            id="barcode"
            type="text"
            className="form-control"
            value={bookData.barcode}
            onChange={(e) => setBookData({ ...bookData, barcode: e.target.value })}
            placeholder="Barcode"
          />
        </div>

        {/* Campo per l'editore */}
        <div className="mb-3">
          <label htmlFor="publisher" className="form-label">Publisher</label>
          <input
            id="publisher"
            type="text"
            className="form-control"
            value={bookData.publisher}
            onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
            placeholder="Publisher"
          />
        </div>

        {/* Campo per la descrizione */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={bookData.description}
            onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
            placeholder="Description"
          />
        </div>

        {/* Campo per lo stato del libro */}
        <div className="mb-3">
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

        {/* Pulsanti per salvare o eliminare il libro */}
        <button type="button" className="btn btn-primary me-2" onClick={handleSave}>
          Save
        </button>
        {id && (
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        )}
      </form>
    </div>
  );
};

export default BookDetails;
