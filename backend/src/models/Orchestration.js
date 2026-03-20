import mongoose from 'mongoose';

const orchestrationSchema = new mongoose.Schema({
  email: String,
  query: String,
  text: String,
  structuredData: mongoose.Schema.Types.Mixed,
  n8nStatus: String,
  createdAt: { type: Date, default: Date.now },
});

const Orchestration = mongoose.model('Orchestration', orchestrationSchema);

export default Orchestration;
