import mongoose from "mongoose";

const PhrasesSchema = new mongoose.Schema({
  phrases: {
    nostalgic: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    cosy: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    focus: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    energetic: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    inspirational: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    relaxed: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    grateful: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ]
  }
});


const Phrase = mongoose.model('Phrase', PhrasesSchema, 'phrases');

export default Phrase;