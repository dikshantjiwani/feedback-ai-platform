const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  email: String,
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      answer: String,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

responseSchema.index({ formId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Response', responseSchema);
