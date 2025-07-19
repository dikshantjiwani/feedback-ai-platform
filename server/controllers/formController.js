const Form = require('../models/Form');
const { nanoid } = require('nanoid');

// @route POST /api/form/create
exports.createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const slug = nanoid(8); // unique form link ID

    const form = await Form.create({
      title,
      questions,
      createdBy: req.user._id,
      slug,
    });

    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/form/:slug (public)
exports.getFormBySlug = async (req, res) => {
  console.log("Requested slug:", req.params.slug);
  try {
    const form = await Form.findOne({ slug: req.params.slug });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/form/admin/all
exports.getFormsByAdmin = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id }).sort({ _id: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @route POST /api/form/suggest
exports.suggestQuestions = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Suggest 3-5 feedback questions for: ${prompt}.
                    Format the response as a JSON array like:
                    [{"questionText": "How easy was it to use?", "type": "mcq"}, ...]`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    // Try parsing the AI response safely
    try {
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch (parseErr) {
      console.error("JSON parsing failed:", content);
      res.status(500).json({ message: "Failed to parse AI response." });
    }

  } catch (err) {
    console.error("OpenAI API Error:", err.message || err);
    res.status(500).json({ message: "AI generation failed" });
  }
};


