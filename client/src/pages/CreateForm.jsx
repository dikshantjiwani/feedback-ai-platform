import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", type: "text", options: [] }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/form/suggest", { prompt: newPrompt });
      setQuestions(res.data);
    } catch (err) {
      alert("AI Model will be integrated soon. SOrry for the delay!");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title || questions.length === 0) return alert("Title and questions required");
    try {
      const res = await api.post("/form/create", { title, questions });
      alert("Form created!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating form");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Form</h1>

      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {questions.map((q, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder={`Question ${index + 1}`}
            value={q.questionText}
            onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
          />
          <select
            value={q.type}
            onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
            className="border p-2 mb-2"
          >
            <option value="text">Text</option>
            <option value="mcq">Multiple Choice</option>
          </select>

          {q.type === "mcq" && (
            <div>
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  className="border p-1 mr-2"
                  onChange={(e) => handleOptionChange(index, i, e.target.value)}
                />
              ))}
              <button className="text-blue-600 underline" onClick={() => addOption(index)}>+ Add Option</button>
            </div>
          )}
        </div>
      ))}

      <button onClick={handleAddQuestion} className="bg-gray-800 text-white px-4 py-2 rounded mr-4">
        + Add Question
      </button>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
        ✅ Create Form
      </button>

      <hr className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-2">💡 AI Suggest Questions</h2>
        <input
          type="text"
          placeholder="e.g., feedback for mobile app"
          className="border p-2 w-full mb-2"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleAIGenerate}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Suggest with AI"}
        </button>
      </div>
    </div>
  );
}
