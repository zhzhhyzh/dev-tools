import { useState, useMemo } from 'react';
import { tools, categories } from '../tools/toolsRegistry';
import ToolCard from './ToolCard';
import './Dashboard.css';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        search === '' ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="dashboard">
      <div className="dashboard-brand">
        <h1>DevTools Hub</h1>
        <p>All the developer utilities you need, in one place</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">&#128269;</span>
        <input
          type="text"
          placeholder="Search tools... (e.g. JSON, timestamp, base64)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tools-grid">
        {filtered.length === 0 ? (
          <div className="no-results">No tools found matching your search.</div>
        ) : (
          filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)
        )}
      </div>
    </div>
  );
}
