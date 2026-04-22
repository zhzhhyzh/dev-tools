import { useState, useMemo } from 'react';
import { tools, categories } from '../tools/toolsRegistry';
import ToolCard from './ToolCard';
import './Dashboard.css';

// Assign bento sizes: first 2 tools = lg, next 4 = md, rest = sm
function getBentoSize(index, total) {
  if (total <= 4) return 'sm';
  if (index < 2) return 'lg';
  if (index < 6) return 'md';
  return 'sm';
}

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
      {/* Animated gradient header area */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow" />
        <div className="dashboard-brand">
          <h1>DevTools Hub</h1>
          <p>All the developer utilities you need, in one place</p>
        </div>

        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
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
      </div>

      <div className="bento-grid">
        {filtered.length === 0 ? (
          <div className="no-results">No tools found matching your search.</div>
        ) : (
          filtered.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              size={getBentoSize(i, filtered.length)}
            />
          ))
        )}
      </div>
    </div>
  );
}
