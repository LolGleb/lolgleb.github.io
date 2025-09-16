import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RichContentProps {
  content: string;
  className?: string;
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt?: string; title?: string }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string };

// Very small, dependency-free renderer for article content with inline images and headings
// Supported syntaxes (as a separate line):
// - Markdown image: ![alt](url "optional title")
// - Bare image URL: https://host/image.png or data:image/*
// - Markdown heading: # H, ## H, ### H, etc. (we render # as h2, ## as h3, ### as h4 to avoid multiple h1)
// Everything else is rendered as paragraphs. Blank lines split paragraphs.
export function RichContent({ content, className }: RichContentProps) {
  const blocks = React.useMemo(() => parseContent(content || ''), [content]);

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        if (block.type === 'image') {
          return (
            <figure key={idx} className="my-6">
              <ImageWithFallback
                src={block.src}
                alt={block.alt || 'Article image'}
                className="w-full h-auto rounded-md object-contain bg-muted"
                loading="lazy"
              />
              {block.alt ? (
                <figcaption className="text-sm text-foreground/60 mt-2 text-center" style={{ fontFamily: 'var(--font-body)' }}>
                  {block.alt}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        if (block.type === 'heading') {
          // Map markdown levels to safer in-article headings (avoid duplicate h1)
          const level = Math.min(Math.max(block.level, 1), 6);
          const renderAs = level === 1 ? 2 : level === 2 ? 3 : level === 3 ? 4 : level; // # -> h2, ## -> h3, ### -> h4, others as-is
          const Tag = (`h${renderAs}` as unknown) as keyof JSX.IntrinsicElements;
          const classes = renderAs === 2
            ? 'text-3xl font-semibold mt-8 mb-3'
            : renderAs === 3
            ? 'text-2xl font-semibold mt-6 mb-2'
            : 'text-xl font-semibold mt-4 mb-2';
          return (
            <Tag key={idx} className={classes} style={{ fontFamily: 'var(--font-headlines)' }}>
              {block.text}
            </Tag>
          );
        }
        // paragraph
        return (
          <p key={idx} className="leading-relaxed" style={{ whiteSpace: 'pre-line', fontFamily: 'var(--font-body)' }}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function isImageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  try {
    const u = new URL(trimmed);
    const pathname = u.pathname.toLowerCase();
    return pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.png') || pathname.endsWith('.gif') || pathname.endsWith('.webp') || pathname.endsWith('.avif');
  } catch {
    return false;
  }
}

function parseContent(input: string): ContentBlock[] {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ContentBlock[] = [];

  let paraLines: string[] = [];
  const flushParagraph = () => {
    if (paraLines.length) {
      // Merge with single newlines preserved by pre-line in renderer
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
      paraLines = [];
    }
  };

  const mdImgRegex = /^!\[(.*?)\]\((\S+?)(?:\s+\"([^\"]+)\")?\)$/; // ![alt](url "title")
  const mdHeadingRegex = /^(#{1,6})\s+(.*)$/; // # Heading

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Blank line => paragraph break
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Full-line Markdown image
    const md = line.match(mdImgRegex);
    if (md) {
      flushParagraph();
      const alt = (md[1] || '').trim();
      const src = (md[2] || '').trim();
      const title = (md[3] || '').trim();
      if (src) {
        blocks.push({ type: 'image', src, alt, title });
      }
      continue;
    }

    // Markdown heading
    const mh = line.match(mdHeadingRegex);
    if (mh) {
      flushParagraph();
      const level = Math.min(Math.max(mh[1].length, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const text = (mh[2] || '').trim();
      blocks.push({ type: 'heading', level, text });
      continue;
    }

    // Full-line bare image URL
    if (line.indexOf(' ') === -1 && isImageUrl(line)) {
      flushParagraph();
      blocks.push({ type: 'image', src: line.trim() });
      continue;
    }

    // Otherwise, treat as paragraph text line
    paraLines.push(rawLine);
  }

  flushParagraph();
  return blocks;
}

export default RichContent;
