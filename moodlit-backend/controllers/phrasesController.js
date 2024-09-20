import Phrase from "../models/phrasesModel.js";


export const getRandomPhrase = async (req, res) => {
  const { mood } = req.query;

  if (!mood) {
    return res.status(400).json({ message: '"mood" is required' }); //check se mi passa mood
  }

  try {
    const count = await Phrase.countDocuments({ mood });

    if (count === 0) {
      return res.status(404).json({ message: 'No phrases found' }); //check se c'è frase
    }

    const random = Math.floor(Math.random() * count);
    const phrase = await Phrase.findOne({ mood }).skip(random);

    return res.status(200).json({ text: phrase.text, author: phrase.author });
  } catch (error) {
    console.error('Errore nel recupero della frase:', error);
    return res.status(500).json({ message: 'Errore del server.' });
  }
};

export const addPhrase = async (req, res) => {
  const { mood, text, author } = req.body;

  if (!mood || !text || !author) {
    return res.status(400).json({ message: 'missing fields' });
  }

  try {
    const newPhrase = new Phrase({ mood, text, author });
    await newPhrase.save();
    return res.status(201).json({ message: 'OK', phrase: newPhrase });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
