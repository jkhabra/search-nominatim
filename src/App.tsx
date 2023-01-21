import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./component/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/search-nominatim" element={<Dashboard />}></Route>
          <Route path="*" element={<Navigate to={"/search-nominatim"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
