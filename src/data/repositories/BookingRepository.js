import Booking from '../models/Booking.js';

class BookingRepository {
  async create(data) {
    const booking = new Booking(data);
    return await booking.save();
  }

  async findById(id) {
    return await Booking.findById(id).populate('userId spaceId');
  }

  async findAll() {
    return await Booking.find().populate('userId spaceId');
  }

  async findByUserId(userId) {
    return await Booking.find({ userId }).populate('spaceId');
  }

  async findBySpaceId(spaceId) {
    return await Booking.find({ spaceId }).populate('userId spaceId');
  }

  async update(id, data) {
    return await Booking.findByIdAndUpdate(id, data, { new: true }).populate('userId spaceId');
  }

  async delete(id) {
    return await Booking.findByIdAndDelete(id);
  }
}

export default new BookingRepository();
