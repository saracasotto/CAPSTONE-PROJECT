import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },  
    book: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Book', 
      required: true 
    },  
    startTime: { 
      type: Date, 
      default: Date.now 
    },  
    endTime: { 
      type: Date 
    },  
    duration: { 
      type: Number, 
      default: 0 
    },
    pagesRead: {
      type: Number,
      default: 0
    },
    status: { 
      type: String, 
      enum: ['active', 'completed'], 
      default: 'active' 
    },  
  }, { timestamps: true }); 

const Session = mongoose.model('Session', sessionSchema, 'sessions');

export default Session;