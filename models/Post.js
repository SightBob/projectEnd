import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  organizer_id: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  picture: {
    type: String,
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
    type: String,
  },
  start_time: {
    type: String,
  },
  end_date: {
    type: String,
  },
  end_time: {
    type: String,
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