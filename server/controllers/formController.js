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

exports.suggestQuestions = async (req, res) => {
  const { prompt } = req.body;

  try {
    const hfResponse = await axios.post(
      "https://dikshantjiwani-feedback-ai-platform.hf.space/run/predict",
      { data: [prompt] },
      { headers: { "Content-Type": "application/json" } }
    );

    const textOutput = hfResponse.data.data?.[0];
    const start = textOutput.indexOf("[");
    const end = textOutput.lastIndexOf("]") + 1;

    try {
      const parsed = JSON.parse(textOutput.slice(start, end));
      res.json(parsed);
    } catch {
      throw new Error("JSON parse failed");
    }

  } catch (err) {
    console.error("HF Space error:", err.response?.data || err.message);
    res.status(500).json({ message: "Question suggestion failed." });
  }
};
