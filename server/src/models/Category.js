import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'ACTIVE' }
});

// Use 'export default' instead of 'module.exports'
const Category = mongoose.model('Category', categorySchema);
export default Category;