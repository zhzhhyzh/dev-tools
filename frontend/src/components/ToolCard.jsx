import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ToolCard.css';

export default function ToolCard({ tool, index = 0, size = 'sm' }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--glow-opacity', '1');
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--glow-opacity', '0');
  }, []);

  return (
    <Link
      to={`/tool/${tool.slug}`}
      className={`bento-card bento-${size}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Pointer glow overlay */}
      <div className="bento-card-glow" />
      {/* Border glow overlay */}
      <div className="bento-card-border-glow" />

      <div className="bento-card-content">
        <div className="bento-card-icon">{tool.icon}</div>
        <div className="bento-card-info">
          <div className="bento-card-name">{tool.name}</div>
          <div className="bento-card-desc">{tool.description}</div>
        </div>
        <span className="bento-card-category">{tool.category}</span>
      </div>
    </Link>
  );
}
