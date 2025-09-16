import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RichContentProps {
  content: string;
  className?: string;
}

// Very small, dependency-free renderer for article content with inline images
// Supported syntaxes for images (as a separate line):
// 1) Markdown: ![alt text](https://host/image.jpg "optional title")
// 2) Bare URL to an image: https://host/image.png
// 3) Data URL: data:image/png;base64,...
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

function parseContent(input: string): Array<{ type: 'paragraph'; text: string } | { type: 'image'; src: string; alt?: string; title?: string }> {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Array<{ type: 'paragraph'; text: string } | { type: 'image'; src: string; alt?: string; title?: string }> = [];

  let paraLines: string[] = [];
  const flushParagraph = () => {
    if (paraLines.length) {
      // Merge with single newlines preserved by pre-line in renderer
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
      paraLines = [];
    }
  };

  const mdImgRegex = /^!\[(.*?)\]\((\S+?)(?:\s+\"([^\"]+)\")?\)$/; // ![alt](url "title")

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
