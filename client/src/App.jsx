import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import PublicForm from "./pages/PublicForm";
import Analytics from "./pages/Analytics";
import Header from "./components/Header"; // Your nav bar component

function LayoutWrapper() {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/register"];
  const isPublicFormRoute = location.pathname.startsWith("/form/");
  const hideHeader = hideHeaderRoutes.includes(location.pathname) || isPublicFormRoute;

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/form/:slug" element={<PublicForm />} />
        <Route path="/analytics/:formId" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}
