import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String }
});

export default mongoose.model('User', userSchema);
