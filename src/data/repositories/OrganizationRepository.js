import Organization from '../models/Organization.js';

class OrganizationRepository {
  async create(data) {
    const organization = new Organization(data);
    return await organization.save();
  }

  async findById(id) {
    return await Organization.findById(id).populate('spaces users');
  }

  async findByName(name) {
    return await Organization.findOne({ name }).populate('spaces users');
  }

  async findAll() {
    return await Organization.find().populate('spaces users');
  }

  async update(id, data) {
    return await Organization.findByIdAndUpdate(id, data, { new: true }).populate('spaces users');
  }

  async delete(id) {
    return await Organization.findByIdAndDelete(id);
  }
}

export default new OrganizationRepository();
