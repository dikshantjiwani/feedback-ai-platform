import { useEffect, useState } from "react";
import api from "../services/api";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get("/form/admin/all");
        setForms(res.data);
      } catch (err) {
        console.error("Failed to load forms");
      }
    };
    fetchForms();
  }, []);

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📋 Your Forms</h1>
        <button onClick={() => navigate("/create-form")} className="bg-green-600 text-white px-4 py-2 rounded">
          + New Form
        </button>
      </div>

      {forms.map((form) => (
        <div key={form._id} className="border p-4 rounded mb-4">
          <h2 className="text-lg font-semibold">{form.title}</h2>
          <p className="text-sm text-gray-600">Form ID: {form._id}</p>

          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleCopyLink(form.slug)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              🔗 Copy Link
            </button>

            <button
              onClick={() => navigate(`/analytics/${form._id}`)}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              📊 View Analytics
            </button>
          </div>

          <QRCodeDisplay url={`${window.location.origin}/form/${form.slug}`} />
        </div>
      ))}
    </div>
  );
}
