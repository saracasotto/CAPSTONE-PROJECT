import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id;
    const user = await User.findById(userId)
      .populate({ path: 'books', model: 'Book' }) 
      .populate({ path: 'notes', model: 'Note' }) 
      .populate({ path: 'quotes', model: 'Quote'})
      .populate({ path: 'sessions', model: 'Session' }); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id;
    const { name, email, avatar, themePreference } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar, themePreference },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updtating user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.loggedUser.id; 
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No avatar found' });
    }
    res.status(200).json({ avatarUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
};



//NO AUTH

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error feching users" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { name, birthDate, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, birthDate, avatar },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error update" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
