import { useState } from 'react';

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','porta','nibh','venenatis','cras','fermentum',
  'posuere','urna','nec','tincidunt','praesent','semper','feugiat','pellentesque',
  'massa','placerat','duis','ultricies','lacus','viverra','vitae','congue','eu',
  'consequat','ac','felis','donec','pretium','vulputate','sapien','nec','sagittis',
  'aliquam','malesuada','bibendum','arcu','vivamus','at','augue','eget','imperdiet',
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 14) {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
  const words = [];
  for (let i = 0; i < len; i++) words.push(randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(minSentences = 3, maxSentences = 7) {
  const len = minSentences + Math.floor(Math.random() * (maxSentences - minSentences));
  const sentences = [];
  for (let i = 0; i < len; i++) sentences.push(generateSentence());
  return sentences.join(' ');
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const results = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      if (type === 'paragraphs') results.push(generateParagraph());
      else if (type === 'sentences') results.push(generateSentence());
      else results.push(randomWord());
    }
    setOutput(type === 'paragraphs' ? results.join('\n\n') : type === 'sentences' ? results.join(' ') : results.join(' '));
  };

  return (
    <div className="tool-card-container">
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="tool-row" style={{ flex: 1, minWidth: 120, marginBottom: 0 }}>
          <label>Type</label>
          <select className="tool-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div className="tool-row" style={{ flex: 1, minWidth: 120, marginBottom: 0 }}>
          <label>Count</label>
          <input
            className="tool-input"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
          />
        </div>
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={generate}>Generate</button>
        {output && <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>}
      </div>
      {output && <div className="tool-output" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>}
    </div>
  );
}
