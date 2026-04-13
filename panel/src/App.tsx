import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProjectView from "./pages/ProjectView";
import MarkdownViewer from "./pages/MarkdownViewer";
import QuickFinder from "./components/QuickFinder";
import GitPanel from "./pages/GitPanel";
import AgentSettings from "./pages/AgentSettings";
import { ActiveFileProvider } from "./hooks/useActiveFile";
import { BreadcrumbActionsProvider } from "./components/Breadcrumbs";

export default function App() {
  return (
    <BrowserRouter>
      <ActiveFileProvider>
      <BreadcrumbActionsProvider>
      <QuickFinder />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:name" element={<ProjectView />} />
          <Route path="/project/:name/:section" element={<ProjectView />} />
          <Route path="/view/*" element={<MarkdownViewer />} />
          <Route path="/git" element={<GitPanel />} />
          <Route path="/settings" element={<AgentSettings />} />
        </Routes>
      </Layout>
      </BreadcrumbActionsProvider>
      </ActiveFileProvider>
    </BrowserRouter>
  );
}
