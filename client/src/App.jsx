import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import PublicForm from "./pages/PublicForm";
import Analytics from "./pages/Analytics";
import Header from "./components/Header"; 

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* ✅ persists across all routes if logged in */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/form/:slug" element={<PublicForm />} />
        <Route path="/analytics/:formId" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
