import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PublicForm() {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/form/${slug}`);
        setForm(res.data);

        // initialize answers state
        const initialAnswers = res.data.questions.map((q) => ({
          questionId: q._id,
          answer: "",
        }));
        setAnswers(initialAnswers);
      } catch {
        setError("Form not found or unavailable");
      }
    };
    fetchForm();
  }, [slug]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!email) return alert("Email required");

    try {
      await api.post(`/response/${form._id}`, { email, answers });
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";
      setError(msg);
    }
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!form) return <div className="p-6">Loading form...</div>;
  if (submitted) return <div className="p-6 text-green-600 text-xl">Thank you for your feedback!</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>

      <input
        className="border p-2 w-full mb-4"
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {form.questions.map((q, index) => (
        <div key={q._id} className="mb-4">
          <p className="font-semibold">{q.questionText}</p>
          {q.type === "text" ? (
            <textarea
              className="border p-2 w-full"
              rows="3"
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          ) : (
            <div className="mt-1">
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={opt}
                    onChange={() => handleAnswerChange(index, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit Feedback
      </button>
    </div>
  );
}
