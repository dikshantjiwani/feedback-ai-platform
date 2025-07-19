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

const axios = require("axios");

// @route POST /api/form/suggest
exports.suggestQuestions = async (req, res) => {
  const { prompt } = req.body;

  const fullPrompt = `Suggest 3-5 feedback questions for: ${prompt}.
Return the result as a JSON array like:
[
  {"questionText": "...", "type": "mcq"},
  ...
]`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      { inputs: fullPrompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const textOutput = response.data?.[0]?.generated_text || "";
    const jsonStart = textOutput.indexOf("[");
    const jsonEnd = textOutput.lastIndexOf("]") + 1;

    try {
      const parsed = JSON.parse(textOutput.slice(jsonStart, jsonEnd));
      res.json(parsed);
    } catch (err) {
      console.error("JSON Parse Error:", textOutput);
      res.status(500).json({ message: "Failed to parse HF response." });
    }
  } catch (err) {
    console.error("Hugging Face Error:", err.message || err);
    res.status(500).json({ message: "HF model request failed" });
  }
};



