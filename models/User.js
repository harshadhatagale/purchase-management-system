import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  gender: { type: String, required: true },
  position: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
