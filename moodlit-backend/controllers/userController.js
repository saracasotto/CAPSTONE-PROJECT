import User from "../models/userModel.js";

//OTTENERE DATI
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

//AGGIORNARE DATI UTENTE
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

//CANCELLARE DATI UTENTE
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.loggedUser.id);
    res.status(200).json({ message: "Account cancellato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nella cancellazione dell'account" });
  }
};
