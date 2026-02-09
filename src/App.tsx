import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DocumentationLayout from "./components/DocumentationLayout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import FolderPage from "./pages/FolderPage";
import "./App.css";
import "./components/Navbar.css";

const PromptBuilder = lazy(() => import("./pages/PromptBuilder"));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <DocumentationLayout>
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/builder" element={<PromptBuilder />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/category/:categoryId/:folderId" element={<FolderPage />} />
            </Routes>
          </Suspense>
          <Footer />
        </DocumentationLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
