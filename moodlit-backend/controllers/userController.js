import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.loggedUser.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei dati utente" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, birthDate, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.loggedUser.id,
      { name, birthDate, avatar },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento dei dati" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.loggedUser.id);
    res.status(200).json({ message: "Account cancellato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nella cancellazione dell'account" });
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

// Aggiornare un utente specifico
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


// Cancellare un utente specifico
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

export const uploadUserProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessuna immagine fornita' });
    }

    // Carica l'immagine su Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({ folder: 'users' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
      stream.end(req.file.buffer);
    });

    res.status(200).json({ avatarUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel caricamento dell\'immagine del profilo', error: error.message });
  }
};