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

const SharePromptPage = lazy(() => import("./pages/SharePromptPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ImageOfDayPage = lazy(() => import("./pages/ImageOfDayPage"));
const SubmitImagePage = lazy(() => import("./pages/SubmitImagePage"));
const FaceSwap = lazy(() => import("./pages/FaceSwap"));
const HeadSwap = lazy(() => import("./pages/HeadSwap"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const ImageArchivePage = lazy(() => import("./pages/ImageArchivePage"));

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
                <Route path="/share" element={<SharePromptPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/image-of-the-day" element={<ImageOfDayPage />} />
                <Route path="/image-of-the-day/archive" element={<ImageArchivePage />} />
                <Route path="/submit-image-of-the-day" element={<SubmitImagePage />} />
                <Route path="/face-swap" element={<FaceSwap />} />
                <Route path="/head-swap" element={<HeadSwap />} />

                {/* Legal & Info Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/prompts" element={<CommunityPage />} />

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
