const Form = require('../models/Form');
const { nanoid } = require('nanoid');
const { exec } = require("child_process");
const path = require("path");

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


exports.suggestQuestions = async (req, res) => {
  const { prompt } = req.body;
  const scriptPath = path.join(__dirname, "../scripts/suggest.py");

  try {
    exec(`python3 "${scriptPath}" "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", stderr);
        return res.status(500).json({ message: "Local AI suggestion failed." });
      }

      try {
        const start = stdout.indexOf("[");
        const end = stdout.lastIndexOf("]") + 1;
        const json = JSON.parse(stdout.slice(start, end));
        res.json(json);
      } catch (parseErr) {
        console.error("Parsing error:", stdout);
        res.status(500).json({ message: "Parsing local model output failed." });
      }
    });
  } catch (err) {
    console.error("Exec error:", err.message);
    res.status(500).json({ message: "Failed to invoke local model." });
  }
};