import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  password: {
    type: String,
  },
  major: {
    type: String,
  },
  field_of_study: {
    type: String,
  },
  preferred_categories: [{
    type: Object,
    default: {}
  }],
  notification_settings: {
    type: Object,
    default: {}
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
}, {
  timestamps: true,
  collection: 'Users_col' 
});

// Check if the model already exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;