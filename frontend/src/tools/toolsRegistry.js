import { lazy } from 'react';

const UnixTimestamp = lazy(() => import('./UnixTimestamp'));
const DateTimeFormatter = lazy(() => import('./DateTimeFormatter'));
const JsonFormatter = lazy(() => import('./JsonFormatter'));
const XmlFormatter = lazy(() => import('./XmlFormatter'));
const Base64Codec = lazy(() => import('./Base64Codec'));
const UrlCodec = lazy(() => import('./UrlCodec'));
const Calculator = lazy(() => import('./Calculator'));
const QrGenerator = lazy(() => import('./QrGenerator'));
const UuidGenerator = lazy(() => import('./UuidGenerator'));
const HashGenerator = lazy(() => import('./HashGenerator'));
const RegexTester = lazy(() => import('./RegexTester'));
const LoremIpsumGenerator = lazy(() => import('./LoremIpsumGenerator'));
const ColorPicker = lazy(() => import('./ColorPicker'));
const OnlineNotepad = lazy(() => import('./OnlineNotepad'));

export const tools = [
  {
    id: 1,
    name: 'Unix Timestamp Converter',
    slug: 'unix-timestamp',
    category: 'DateTime',
    description: 'Convert between Unix timestamps and human-readable dates instantly.',
    icon: '\u{1F552}',
    keywords: ['unix', 'timestamp', 'epoch', 'date', 'time', 'convert'],
    component: UnixTimestamp,
  },
  {
    id: 2,
    name: 'Date/Time Formatter',
    slug: 'datetime-formatter',
    category: 'DateTime',
    description: 'Format dates between various patterns (ISO, locale, custom).',
    icon: '\u{1F4C5}',
    keywords: ['date', 'time', 'format', 'iso', 'locale', 'pattern'],
    component: DateTimeFormatter,
  },
  {
    id: 3,
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'Data Format',
    description: 'Beautify, minify, and validate JSON data with syntax highlighting.',
    icon: '\u{1F4CB}',
    keywords: ['json', 'format', 'beautify', 'minify', 'validate', 'parse'],
    component: JsonFormatter,
  },
  {
    id: 4,
    name: 'XML Formatter & Validator',
    slug: 'xml-formatter',
    category: 'Data Format',
    description: 'Beautify, minify, and validate XML documents.',
    icon: '\u{1F4C4}',
    keywords: ['xml', 'format', 'beautify', 'minify', 'validate', 'parse'],
    component: XmlFormatter,
  },
  {
    id: 5,
    name: 'Base64 Encoder/Decoder',
    slug: 'base64',
    category: 'Encoding',
    description: 'Encode text to Base64 or decode Base64 strings back to text.',
    icon: '\u{1F510}',
    keywords: ['base64', 'encode', 'decode', 'binary', 'string'],
    component: Base64Codec,
  },
  {
    id: 6,
    name: 'URL Encoder/Decoder',
    slug: 'url-codec',
    category: 'Encoding',
    description: 'Encode or decode URL components and query strings.',
    icon: '\u{1F517}',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', 'query'],
    component: UrlCodec,
  },
  {
    id: 7,
    name: 'Calculator',
    slug: 'calculator',
    category: 'Math',
    description: 'A powerful online calculator for quick computations.',
    icon: '\u{1F5A9}',
    keywords: ['calculator', 'math', 'compute', 'arithmetic', 'expression'],
    component: Calculator,
  },
  {
    id: 8,
    name: 'QR Code Generator',
    slug: 'qr-generator',
    category: 'Generator',
    description: 'Generate QR codes from any text or URL. Download as image.',
    icon: '\u{1F4F1}',
    keywords: ['qr', 'qrcode', 'barcode', 'generate', 'image'],
    component: QrGenerator,
  },
  {
    id: 9,
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'Generator',
    description: 'Generate random UUID v4 identifiers for your applications.',
    icon: '\u{1F3B2}',
    keywords: ['uuid', 'guid', 'random', 'unique', 'id', 'identifier'],
    component: UuidGenerator,
  },
  {
    id: 10,
    name: 'Hash Generator',
    slug: 'hash-generator',
    category: 'Crypto',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text.',
    icon: '\u{1F512}',
    keywords: ['hash', 'md5', 'sha', 'sha256', 'sha512', 'checksum', 'crypto'],
    component: HashGenerator,
  },
  {
    id: 11,
    name: 'Regex Tester',
    slug: 'regex-tester',
    category: 'Text',
    description: 'Test regular expressions with live matching and capture groups.',
    icon: '\u{1F9EA}',
    keywords: ['regex', 'regexp', 'regular', 'expression', 'match', 'test', 'pattern'],
    component: RegexTester,
  },
  {
    id: 12,
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum',
    category: 'Text',
    description: 'Generate placeholder text for your designs and prototypes.',
    icon: '\u{1F4DD}',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'content'],
    component: LoremIpsumGenerator,
  },
  {
    id: 13,
    name: 'Color Picker & Converter',
    slug: 'color-picker',
    category: 'Design',
    description: 'Pick colors and convert between HEX, RGB, and HSL formats.',
    icon: '\u{1F3A8}',
    keywords: ['color', 'colour', 'hex', 'rgb', 'hsl', 'picker', 'convert'],
    component: ColorPicker,
  },
  {
    id: 14,
    name: 'Online Notepad',
    slug: 'online-notepad',
    category: 'Collaboration',
    description: 'Real-time collaborative notepad synced via WebSocket. Share a pad ID to co-edit.',
    icon: '\u{1F4DD}',
    keywords: ['notepad', 'note', 'text', 'editor', 'collaborative', 'realtime', 'websocket', 'share'],
    component: OnlineNotepad,
  },
];

export const categories = [...new Set(tools.map((t) => t.category))];
