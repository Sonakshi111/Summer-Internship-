
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Register from "./pages/Register"; // optional, if already exists
import Login from "./pages/Login";      // will add later
import SelectedList from "./pages/SelectedList"; // will add later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selected" element={<SelectedList />} />
      </Routes>
    </Router>
  );
}

export default App;
