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
  console.log("[INFO] Received prompt:", prompt);

  try {
    const response = await axios.post(
      "https://dikshantjiwani-feedback-ai-platform.hf.space/run/predict",
      { data: [prompt] },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20000, // 20s timeout
      }
    );

    console.log("[INFO] HF raw response:", response.data);

    const resultText = response.data?.data?.[0] || "";
    console.log("[INFO] Generated text from Space:", resultText);

    const start = resultText.indexOf("[");
    const end = resultText.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) {
      console.error("[ERROR] Could not locate JSON brackets in output.");
      return res.status(500).json({ message: "Failed to parse generated JSON." });
    }

    const rawJson = resultText.slice(start, end);
    console.log("[INFO] Extracted JSON string:", rawJson);

    try {
      const parsed = JSON.parse(rawJson);
      console.log("[SUCCESS] Parsed questions:", parsed);
      return res.json(parsed);
    } catch (parseErr) {
      console.error("[ERROR] JSON.parse failed:", parseErr.message);
      return res.status(500).json({ message: "Failed to parse AI response." });
    }

  } catch (err) {
    if (err.response) {
      console.error("[ERROR] Hugging Face API response error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("[ERROR] No response from Hugging Face:", err.message);
    } else {
      console.error("[ERROR] Unexpected error:", err.message);
    }

    return res.status(500).json({ message: "HF Space request failed." });
  }
};
