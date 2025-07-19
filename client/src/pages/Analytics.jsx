import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

export default function Analytics() {
  const { formId } = useParams();
  const [analytics, setAnalytics] = useState([]);
  const [rawResponses, setRawResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/response/${formId}/analytics`);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error("Analytics fetch failed");
      }
    };

    const fetchRaw = async () => {
      try {
        const res = await api.get(`/response/${formId}/raw`);
        setRawResponses(res.data);
      } catch (err) {
        console.error("Raw response fetch failed");
      }
    };

    fetchData();
    fetchRaw();
  }, [formId]);

  const handleCSVExport = () => {
    const token = localStorage.getItem("token");
    const downloadUrl = `http://localhost:5000/api/response/${formId}/export`;

    fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "feedback.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert("Export failed"));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Analytics</h1>
        <button
          onClick={handleCSVExport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📤 Export as CSV
        </button>
      </div>

      {analytics.map((item, idx) => (
        <div key={idx}>
          {item.type === "mcq" ? (
            <AnalyticsChart question={item.question} data={item.data} />
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
              <ul className="list-disc pl-6 space-y-1">
                {item.data.map((ans, i) => (
                  <li key={i}>{ans}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Raw response section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📝 Individual User Responses</h2>
        {rawResponses.map((response, i) => (
          <div
            key={i}
            className="mb-6 border rounded-lg p-4 bg-gray-50 shadow-sm"
          >
            <div className="text-sm text-gray-600 mb-2">
              📧 <strong>{response.user?.email || "Anonymous"}</strong> — 🕒{" "}
              {new Date(response.createdAt).toLocaleString()}
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {response.answers.map((ans, j) => (
                <li key={j}>
                  <strong>{ans.question}</strong>: {ans.answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
