import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!token) return null; // don't show if not logged in

  return (
    <header className="bg-gray-100 border-b mb-6 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">📋 Feedback Platform</h2>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 font-medium hover:underline"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
