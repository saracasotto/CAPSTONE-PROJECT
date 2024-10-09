import Book from '../models/bookModel.js';
import User from '../models/userModel.js';
import Note from '../models/noteModel.js';
import Quote from '../models/quoteModel.js';
import Category from '../models/categoryModel.js';


export const addBook = async (req, res) => {
  try {
    const { cover, title, author, category, newCategory, barcode, publisher, description, status, progress } = req.body;
    const userId = req.loggedUser.id; 

    let categoryId;

    // Case 1: i create a new category
    if (newCategory) {
      const createdCategory = new Category({
        name: newCategory,
        user: userId,  // associate category to logged user
      });
      await createdCategory.save();
      categoryId = createdCategory._id;  //id category
    } else if (category) {

      // Case 2: I use an existing category
      const foundCategory = await Category.findOne({ _id: category, user: userId });

      if (!foundCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      categoryId = foundCategory._id;
    } else {
      return res.status(400).json({ message: "Error getting category" });
    }

    const newBook = new Book({
      cover: cover || 'https://res.cloudinary.com/dg3ztnyg9/image/upload/v1728463747/Moodlit/wfniu4yhpzswmjt2mmmf.png',
      title,
      author,
      category: categoryId, 
      barcode,
      publisher,
      description,
      status,
      progress,
      user: userId
    });

    await newBook.save();

    const user = await User.findById(userId);
    user.books.push(newBook._id);  
    await user.save(); 


    const categoryToUpdate = await Category.findById(categoryId);
    categoryToUpdate.books.push(newBook._id);
    await categoryToUpdate.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book ", error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const userId = req.loggedUser.id; 
    const books = await Book.find({ user: userId }).populate('category', 'name'); 

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error getting books", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const userId = req.loggedUser.id; 
    const bookId = req.params.id; 

    // Find the book by Id, only if it's of the logged user
    const book = await Book.findOne({ _id: bookId, user: userId }).populate('category', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error getting book", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { cover, title, author, category, barcode, publisher, description, status } = req.body;
    const userId = req.loggedUser.id; 

    // Update the logged user book 
    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, user: userId }, 
      { title, author, category, barcode, publisher, description, status, cover },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.loggedUser.id;


    const book = await Book.findOne({ _id: id, user: userId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // remove ref.
    await User.findByIdAndUpdate(userId, { $pull: { books: id } });

    if (book.category) {
      await Category.findByIdAndUpdate(book.category, { $pull: { books: id } });
    }

    // Remove notes and quotes associated
    await Note.deleteMany({ book: id });
    await Quote.deleteMany({ book: id });

    // Remove book
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser._id }, 
      { progress }, 
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating" });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalPages } = req.body;
    const userId = req.loggedUser.id;

    const book = await Book.findOne({ _id: id, user: userId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.status = status;

    if (status === 'completed' && totalPages) {
      book.progress = totalPages;
    }

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating the book", error: error.message });
  }
};

export const uploadBookCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image found' });
    }

    // return cloudinary path
    res.status(200).json({ coverUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Errore uploading cover', error: error.message });
  }
};




//NO AUTH

export const getBookByIdWithoutAuth = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const addBookWithoutAuth = async (req, res) => {
  try {
    const { cover, title, author, category, barcode, publisher, description, status, progress } = req.body;

   
    const newBook = new Book({
      cover: cover || 'https://res.cloudinary.com/dg3ztnyg9/image/upload/v1727198157/default/aaiyvs5jrwkz4pau30hi.png',  // Usa l'URL della copertina o un valore di default
      title,
      author,
      category,
      barcode,
      publisher,
      description,
      status,
      progress
    });

    await newBook.save();  
    res.status(201).json(newBook);  
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};


export const getAllBooksWithoutAuth = async (req, res) => {
  try {
    
    const books = await Book.find().populate('user', 'name email').populate('category', 'name');
    
    
    res.status(200).json(books);
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};

export const updateBookWithoutAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const { cover, title, author, category, barcode, publisher, description, status } = req.body;

  
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, category, barcode, publisher, description, status, cover },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updtating book", error: error.message });
  }
};


export const deleteBookWithoutAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id); // Elimina il libro dal database

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};


