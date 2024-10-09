import Phrase from "../models/phrasesModel.js";


export const getRandomPhrase = async (req, res) => {
  const { mood } = req.query;  

  if (!mood) {
    return res.status(400).json({ message: '"mood" is required' });
  }

  try {

    const phrasesDocument = await Phrase.findOne();  

    if (!phrasesDocument || !phrasesDocument.phrases || !phrasesDocument.phrases[mood]) {
      return res.status(404).json({ message: `No phrases found for mood: ${mood}` });
    }

    const moodPhrases = phrasesDocument.phrases[mood];
    const randomIndex = Math.floor(Math.random() * moodPhrases.length);
    const randomPhrase = moodPhrases[randomIndex];

    return res.status(200).json({ text: randomPhrase.text, author: randomPhrase.author });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
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
    return res.status(500).json({ message: 'Server error.' });
  }
};
