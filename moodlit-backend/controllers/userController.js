import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id;

    // Popola i campi associati come 'books', 'notes', 'sessions'
    const user = await User.findById(userId)
      .populate({ path: 'books', model: 'Book' }) 
      .populate({ path: 'notes', model: 'Note' }) 
      .populate({ path: 'quotes', model: 'Quote'})
      .populate({ path: 'sessions', model: 'Session' }); 

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei dati utente", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT
    const { name, email, avatar, themePreference } = req.body;

    // Aggiorna i dati dell'utente loggato
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar, themePreference },
      { new: true, runValidators: true } // `runValidators` assicura che i campi aggiornati rispettino lo schema
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento dei dati utente", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT

    // Trova ed elimina l'utente loggato
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json({ message: "Account utente eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione dell'account", error: error.message });
  }
};

export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessuna immagine fornita' });
    }

    // Poiché il file è già caricato su Cloudinary, possiamo semplicemente restituire il percorso
    res.status(200).json({ avatarUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel caricamento dell\'avatar', error: error.message });
  }
};



//SENZA AUTH
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Seleziona tutti tranne le password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli utenti" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { name, birthDate, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, // Usa l'id passato nell'URL
      { name, birthDate, avatar },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento dei dati utente" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json({ message: "Utente cancellato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nella cancellazione dell'utente" });
  }
};
