import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Camera from "../camera";
function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Camera" element={<Camera />} />
      </Routes>
    </Router>
  );
}

export default Main;
