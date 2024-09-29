import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Categoria legata a un utente
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]  // Array di riferimenti ai libri
  });


const Category = mongoose.model('Category', categorySchema, 'categories');

export default Category