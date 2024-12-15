import mongoose from 'mongoose';

const PositionSchema = new mongoose.Schema({
  name: {type:String, required: true},
  description: {type: String, required:true},
});

export default mongoose.models.Position || mongoose.model("Position", PositionSchema);
