import mongoose from "mongoose";

const PhrasesSchema = new mongoose.Schema(
    {
      mood: {
        type: String,
        enum: ['nostalgic', 'cosy', 'focus', 'energetic', 'inspirational', 'relaxed', 'grateful'], 
        required: true,
        index: true,
      },
      text: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );


const Phrase = mongoose.model('Phrase', PhrasesSchema, 'phrases');

export default Phrase;