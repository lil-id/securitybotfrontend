import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import Dashboard from "./components/Dashboard";
import AlertsSummary from "./components/Summary";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/summary" element={<AlertsSummary />} />
      </Routes>
    </Router>
  );
}
