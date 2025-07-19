const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'mcq'], required: true },
  questionText: String,
  options: [String],
});

const formSchema = new mongoose.Schema({
  title: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [questionSchema],
  slug: { type: String, unique: true },
});

module.exports = mongoose.model('Form', formSchema);
