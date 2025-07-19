import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

export default function Analytics() {
  const { formId } = useParams();
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/response/${formId}/analytics`);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error("Analytics fetch failed");
      }
    };
    fetchData();
  }, [formId]);

  // ⬇️ CSV export handler
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
    </div>
  );
}
