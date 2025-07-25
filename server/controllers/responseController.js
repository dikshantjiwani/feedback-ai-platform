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
    if (!form) return res.status(404).json({ message: "Form not found" });

    const responses = await Response.find({ formId });

    const analytics = form.questions.map((q) => {
      if (q.type === "mcq") {
        const counts = {};
        q.options.forEach((opt) => (counts[opt] = 0));

        responses.forEach((r) => {
          const ans = r.answers.find((a) => a.questionId.toString() === questionId.toString());
          if (ans && counts.hasOwnProperty(ans.answer)) {
            counts[ans.answer]++;
          }
        });

        return {
          question: q.questionText,
          type: "mcq",
          data: counts,
        };
      } else {
        const texts = responses
          .map((r) => r.answers.find((a) => a.question === q.questionText)?.answer)
          .filter(Boolean);

        return {
          question: q.questionText,
          type: "text",
          data: texts,
        };
      }
    });

    res.json({ analytics });
  } catch (err) {
    console.error("[ERROR] Analytics failed:", err);
    res.status(500).json({ message: "Failed to generate analytics" });
  }
};



// @route GET /api/response/:formId/export
exports.exportCSV = async (req, res) => {
  try {
    const { formId } = req.params;

    // Populate the user to get their email
    const responses = await Response.find({ formId })
      .populate('user', 'email') // ⬅️ populate only the email field from User
      .lean();

    if (!responses.length) {
      return res.status(404).json({ message: "No responses found." });
    }

    const flatData = responses.map((r) => {
      const flat = {
        email: r.email || "Anonymous",
      };

      r.answers.forEach((a, i) => {
        flat[`Q${i + 1}`] = a.answer || "";
      });

      return flat;
    });

    const parser = new Parser();
    const csv = parser.parse(flatData);

    res.header("Content-Type", "text/csv");
    res.attachment("feedback.csv");
    res.send(csv);
  } catch (err) {
    console.error("[CSV EXPORT ERROR]", err);
    res.status(500).json({ message: "Export failed" });
  }
};

// @route GET /api/response/:formId/raw
exports.getRawResponses = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).populate("user", "email");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch raw responses" });
  }
};