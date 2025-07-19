const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  email: String,
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      question: String,
      answer: String,
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Response", responseSchema);
