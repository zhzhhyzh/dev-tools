import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import { Suspense } from 'react';
import Dashboard from './components/Dashboard';
import { tools } from './tools/toolsRegistry';
import './App.css';

function ToolPage() {
  const { slug } = useParams();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="tool-page">
        <div className="tool-header">
          <Link to="/" className="back-btn">← Back</Link>
          <h1>Tool Not Found</h1>
        </div>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-btn">← Dashboard</Link>
        <h1>{tool.name}</h1>
      </div>
      <Suspense fallback={<div style={{ color: 'var(--text-secondary)' }}>Loading...</div>}>
        <ToolComponent />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tool/:slug" element={<ToolPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
