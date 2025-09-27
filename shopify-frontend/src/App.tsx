import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Marketplace from "./pages/Marketplace";

function App() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Marketplace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
