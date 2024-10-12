// models/BotMessage.js
import mongoose from 'mongoose';

const BotMessageSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true,
    unique: true 
  },
  answer: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'general' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true,
  collection: 'BotMessages_col'
});

const BotMessage = mongoose.models.BotMessage || mongoose.model('BotMessage', BotMessageSchema);

export default BotMessage;