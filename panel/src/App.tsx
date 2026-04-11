import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProjectView from "./pages/ProjectView";
import MarkdownViewer from "./pages/MarkdownViewer";
import QuickFinder from "./components/QuickFinder";
import GitPanel from "./pages/GitPanel";
import { ActiveFileProvider } from "./hooks/useActiveFile";

export default function App() {
  return (
    <BrowserRouter>
      <ActiveFileProvider>
      <QuickFinder />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:name" element={<ProjectView />} />
          <Route path="/project/:name/:section" element={<ProjectView />} />
          <Route path="/view/*" element={<MarkdownViewer />} />
          <Route path="/git" element={<GitPanel />} />
        </Routes>
      </Layout>
      </ActiveFileProvider>
    </BrowserRouter>
  );
}
