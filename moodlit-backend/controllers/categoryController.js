import Category from "../models/categoryModel.js";


export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({
      name,
      user: req.loggedUser.id,  
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error adding a new category", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    
    const categories = await Category.find({ user: req.loggedUser.id }).populate('books');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Errore fetching categories", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, books } = req.body;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser.id },  
      { name, books }, 
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id, user: req.loggedUser.id });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category successfully deletedd" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

export const getBooksByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, user: req.loggedUser.id }).populate('books');

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!category.books || category.books.length === 0) {
      return res.status(200).json([]); // Empty array if there are no books
    }

    res.status(200).json(category.books);
  } catch (error) {
    res.status(500).json({ message: "Error finding books", error: error.message });
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
    res.status(500).json({ message: "Error adding category" });
  }
};

export const getCategoriesWithoutAuth = async (req, res) => {
  try {
    const categories = await Category.find().populate('books');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const updateCategoryWithoutAuth = async (req, res) => {
  try {
    const { name, books } = req.body;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name, books }, 
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating" });
  }
};

export const deleteCategoryWithoutAuth = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ _id: req.params.id });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
