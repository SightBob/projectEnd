// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'Messages'
});
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;