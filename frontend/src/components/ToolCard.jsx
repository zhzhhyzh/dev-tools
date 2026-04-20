import { Link } from 'react-router-dom';
import './ToolCard.css';

export default function ToolCard({ tool }) {
  return (
    <Link to={`/tool/${tool.slug}`} className="tool-card">
      <div className="tool-card-icon">{tool.icon}</div>
      <div className="tool-card-name">{tool.name}</div>
      <div className="tool-card-desc">{tool.description}</div>
      <span className="tool-card-category">{tool.category}</span>
    </Link>
  );
}
