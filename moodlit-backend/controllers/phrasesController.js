import Phrase from "../models/phrasesModel.js";


export const getRandomPhrase = async (req, res) => {
  const { mood } = req.query;  // Verifica che il mood sia passato correttamente

  if (!mood) {
    return res.status(400).json({ message: '"mood" is required' });
  }

  try {
    // Trova il documento che contiene le frasi
    const phrasesDocument = await Phrase.findOne();  // Trova il documento con tutti i mood

    // Verifica se il documento contiene il campo 'phrases'
    if (!phrasesDocument || !phrasesDocument.phrases || !phrasesDocument.phrases[mood]) {
      return res.status(404).json({ message: `No phrases found for mood: ${mood}` });
    }

    // Estrai l'array di frasi per il mood selezionato
    const moodPhrases = phrasesDocument.phrases[mood];

    // Seleziona una frase casuale dall'array
    const randomIndex = Math.floor(Math.random() * moodPhrases.length);
    const randomPhrase = moodPhrases[randomIndex];

    return res.status(200).json({ text: randomPhrase.text, author: randomPhrase.author });
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
