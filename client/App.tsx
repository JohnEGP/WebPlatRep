import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/users" element={<div>Users (Coming Soon)</div>} />
        <Route path="/stock" element={<div>Stock (Coming Soon)</div>} />
        <Route path="/budgets" element={<div>Budgets (Coming Soon)</div>} />
        <Route path="/reports" element={<div>Reports (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
