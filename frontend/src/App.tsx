
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Register from "./pages/Register"; // optional, if already exists
import Login from "./pages/Login";      // will add later
import SelectedList from "./pages/SelectedList"; // will add later
import Dashboard from "./Dashboard";
import BatchAllotmentForm from "./pages/BatchAllotmentForm";
import ChallanPage from "./pages/challanPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selected" element={<SelectedList />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/batch-form" element={<BatchAllotmentForm />} />
          <Route path="/challan" element={<ChallanPage />} />
          <Route path="/batch-allotment" element={<BatchAllotmentForm />} />



      </Routes>
    </Router>
  );
}

export default App;
