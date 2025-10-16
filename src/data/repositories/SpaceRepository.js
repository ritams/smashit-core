import Space from '../models/Space.js';

class SpaceRepository {
  async create(data) {
    const space = new Space(data);
    return await space.save();
  }

  async findById(id) {
    return await Space.findById(id).populate('bookings');
  }

  async findByName(name) {
    return await Space.findOne({ name });
  }

  async findAll() {
    return await Space.find().populate('bookings');
  }

  async update(id, data) {
    return await Space.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Space.findByIdAndDelete(id);
  }

  async countBookings(spaceId) {
    // Assuming we update Booking later
    // return await Booking.countDocuments({ spaceId });
    // For now, placeholder
    return 0;
  }
}

export default new SpaceRepository();
