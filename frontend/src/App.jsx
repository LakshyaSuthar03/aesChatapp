import { Routes, Route } from "react-router-dom";
import Join from "./pages/Join/Join";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Join />} />
      </Routes>
    </div>
  );
};

export default App;
