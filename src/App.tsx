import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DocumentationLayout from "./components/DocumentationLayout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import FolderPage from "./pages/FolderPage";
import "./App.css";
import "./components/Navbar.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <DocumentationLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/category/:categoryId/:folderId" element={<FolderPage />} />
          </Routes>
          <Footer />
        </DocumentationLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
