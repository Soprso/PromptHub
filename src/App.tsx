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

import { HelmetProvider } from "react-helmet-async";

const PromptBuilder = lazy(() => import("./pages/PromptBuilder"));
const SeoPage = lazy(() => import("./pages/SeoPage"));

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Navbar />
          <DocumentationLayout>
            <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/builder" element={<PromptBuilder />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/category/:categoryId/:folderId" element={<FolderPage />} />
                {/* SEO Pages - catch-all for top-level slugs */}
                <Route path="/:slug" element={<SeoPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </DocumentationLayout>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
