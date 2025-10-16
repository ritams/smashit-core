import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    maxBookings: {
      type: Number,
      required: true,
      min: 1,
    },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Space', spaceSchema);
