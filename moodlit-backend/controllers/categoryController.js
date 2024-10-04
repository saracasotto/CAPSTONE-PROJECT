import Category from "../models/categoryModel.js";


export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Crea una nuova categoria associata all'utente loggato
    const newCategory = new Category({
      name,
      user: req.loggedUser.id,  // Associa la categoria all'utente loggato
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta della categoria", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Recupera solo le categorie associate all'utente loggato
    const categories = await Category.find({ user: req.loggedUser.id }).populate('books');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle categorie", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, books } = req.body;

    // Aggiorna la categoria solo se appartiene all'utente loggato
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser.id },  // Verifica che l'utente sia il proprietario
      { name, books },  // Aggiorna nome e aggiunge o rimuove libri
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoria non trovata o non autorizzato" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento della categoria", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // Elimina la categoria solo se appartiene all'utente loggato
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id, user: req.loggedUser.id });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoria non trovata o non autorizzato" });
    }

    res.status(200).json({ message: "Categoria eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione della categoria", error: error.message });
  }
};

export const getBooksByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Trova la categoria e popola i libri associati
    const category = await Category.findOne({ _id: id, user: req.loggedUser.id }).populate('books');

    if (!category) {
      return res.status(404).json({ message: "Categoria non trovata o non autorizzato" });
    }

    if (!category.books || category.books.length === 0) {
      return res.status(200).json([]); // Restituisce un array vuoto se non ci sono libri
    }

    res.status(200).json(category.books);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei libri", error: error.message });
  }
};




//NO AUTH
export const addCategoryWithoutAuth = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new Category({
      name,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta della categoria" });
  }
};

export const getCategoriesWithoutAuth = async (req, res) => {
  try {
    const categories = await Category.find().populate('books');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle categorie" });
  }
};

export const updateCategoryWithoutAuth = async (req, res) => {
  try {
    const { name, books } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name, books },  // per aggiornare nome e aggiungere o rimuovere libri
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoria non trovata" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento della categoria" });
  }
};

export const deleteCategoryWithoutAuth = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoria non trovata" });
    }

    res.status(200).json({ message: "Categoria eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione della categoria" });
  }
};
