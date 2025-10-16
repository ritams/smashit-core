import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String, 
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    }
  }, { timestamps: true });

export default mongoose.model('User', userSchema);
