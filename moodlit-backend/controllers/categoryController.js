import Category from "../models/categoryModel.js";


export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new Category({
      name,
      user: req.loggedUser._id, 
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.loggedUser._id }).populate('books');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle categorie" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, books } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser._id }, 
      { name, books }, // per aggiornare nome e aggiungere o rimuovere libri
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoria non trovata" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id, user: req.loggedUser._id });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoria non trovata" });
    }

    res.status(200).json({ message: "Categoria eliminata" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione" });
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
