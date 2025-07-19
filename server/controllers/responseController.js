const mongoose = require('mongoose');
const Response = require('../models/Response');
const Form = require('../models/Form');
const { Parser } = require('json2csv');

// @route POST /api/response/:formId
exports.submitResponse = async (req, res) => {
  const { email, answers } = req.body;
  const { formId } = req.params;

  try {
    // Validate form exists
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Check if this email already submitted response to this form
    const existing = await Response.findOne({ formId, email });
    if (existing) {
      return res.status(409).json({ message: 'Email has already submitted feedback for this form' });
    }

    // Save new response
    const response = await Response.create({
      formId,
      email,
      answers,
    });

    res.status(201).json({ message: 'Feedback submitted successfully', response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/response/:formId (for admin)
exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/response/:formId/analytics
exports.getAnalytics = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const responses = await Response.find({ formId });

    const analytics = form.questions.map((q, idx) => {
      const questionId = q._id.toString();

      if (q.type === 'mcq') {
        const counts = {};
        q.options.forEach(opt => (counts[opt] = 0));

        responses.forEach(r => {
          const ans = r.answers.find(a => a.questionId.toString() === questionId);
          if (ans && counts.hasOwnProperty(ans.answer)) {
            counts[ans.answer]++;
          }
        });

        return {
          question: q.questionText,
          type: 'mcq',
          data: counts,
        };
      } else {
        // For text: return all text answers
        const texts = responses
          .map(r => r.answers.find(a => a.questionId.toString() === questionId)?.answer)
          .filter(Boolean);

        return {
          question: q.questionText,
          type: 'text',
          data: texts,
        };
      }
    });

    res.json({ analytics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @route GET /api/response/:formId/export
exports.exportCSV = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    const flatData = responses.map(r => {
      const flat = { email: r.email };
      r.answers.forEach((a, i) => {
        flat[`Q${i+1}`] = a.answer;
      });
      return flat;
    });

    const parser = new Parser();
    const csv = parser.parse(flatData);

    res.header('Content-Type', 'text/csv');
    res.attachment('feedback.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export failed" });
  }
};

// @route GET /api/response/:formId/raw
exports.getRawResponses = async (req, res) => {
  try {
    const responses = await Response.find({ form: req.params.formId }).populate("user", "email");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch raw responses" });
  }
};
