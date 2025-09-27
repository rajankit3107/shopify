import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Marketplace from "./pages/Marketplace";
// import StoreList from "./components/storecard";

function App() {
  // const storesData = [
  //   {
  //     id: "1",
  //     name: "Gadget Hub",
  //     imageUrl: "/images/gadget.png",
  //     description: "Electronics and accessories store",
  //   },
  //   {
  //     id: "2",
  //     name: "Book World",
  //     imageUrl: "/images/book.png",
  //     description: "Your favorite books and novels",
  //   },
  //   {
  //     id: "3",
  //     name: "Fashion Point",
  //     imageUrl: "/images/fashion.png",
  //     description: "Trendy clothing and accessories",
  //   },
  // ];
  return (
    <>
      <Header />
      {/* <StoreList stores={storesData} /> */}
      <main className="container mx-auto ">
        <Routes>
          <Route path="/" element={<Marketplace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
