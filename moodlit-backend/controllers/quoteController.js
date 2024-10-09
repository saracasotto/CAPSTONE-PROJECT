import Quote from "../models/quoteModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";


export const addQuote = async (req, res) => {
  try {
    const { content } = req.body;
    const { bookId } = req.params;
    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const newQuote = new Quote({
      content,
      book: bookId,
      user: req.loggedUser._id,
    });
    await newQuote.save(); 

    const user = await User.findById(req.loggedUser._id);
    user.quotes.push(newQuote._id);  
    await user.save(); 


    book.quotes.push(newQuote._id);  
    await book.save();  

    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: "Error adding quote", error: error.message });
  }
};


export const getQuotesByBook = async (req, res) => {
  try {
    const quotes = await Quote.find({ book: req.params.bookId, user: req.loggedUser._id })
      .populate('book', 'title author'); 
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotes" });
  }
};


export const updateQuote = async (req, res) => {
  try {
    const { content, shared, sharePlatform } = req.body;
    const updateData = { content, shared, sharePlatform };
    
    if (shared) {
      updateData.sharedAt = Date.now();
    }
    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: req.params.quoteId, user: req.loggedUser._id }, 
      updateData,
      { new: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Error updating quote" });
  }
};


export const deleteQuote = async (req, res) => {
  try {

    const quote = await Quote.findById(req.params.quoteId);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    await Quote.deleteOne({ _id: quote._id });
    await User.findByIdAndUpdate(req.loggedUser._id, {
      $pull: { quotes: req.params.quoteId }, 
    });
    await Book.findByIdAndUpdate(quote.book, {
      $pull: { quotes: req.params.quoteId }, 
    });

    res.json({ message: 'Quote successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

