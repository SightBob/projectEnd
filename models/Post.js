import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  organizer_id: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: null
  },
  category: {
    type: Object,
    default: {},
  },
  participants: {
    type: Number,
    default: 0
  },
  start_date: {
    type: Date,
    required: true
  },
  likes_count: {
    type: Number,
    default: 0
  },
  link_other: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'Posts_col'
});

// Check if the model already exists before creating a new one
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;