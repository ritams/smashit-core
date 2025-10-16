import Booking from '../models/Booking.js';

class BookingRepository {
  async create(data) {
    const booking = new Booking(data);
    return await booking.save();
  }

  async findById(id) {
    return await Booking.findById(id).populate('userId');
  }

  async findAll() {
    return await Booking.find().populate('userId');
  }

  async findByUserId(userId) {
    return await Booking.find({ userId });
  }

  async update(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true }).populate('userId');
  }

  async delete(id) {
    return await Booking.findByIdAndDelete(id);
  }
}

export default new BookingRepository();
