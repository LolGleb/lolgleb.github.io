import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';

export interface ContentEditorHandle {
  insertImageBlocks: (images: Array<{ src: string; alt?: string }>) => void;
  toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  focus: () => void;
}

interface ContentEditorProps {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onFormatStateChange?: (state: { headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) => void;
}

// Utility: escape HTML
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Reuse the same minimal markdown we already support in RichContent
const mdImgRegex = /^!\[(.*?)\]\((\S+?)(?:\s+\"([^\"]+)\")?\)$/; // ![alt](url "title")
const mdHeadingRegex = /^(#{1,6})\s+(.*)$/; // # Heading

function isImageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  try {
    const u = new URL(trimmed);
    const pathname = u.pathname.toLowerCase();
    return (
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.avif')
    );
  } catch {
    return false;
  }
}

// Parse stored value into simple blocks
function parseContentToBlocks(input: string): Array<
  | { type: 'p'; text: string }
  | { type: 'img'; src: string; alt?: string; title?: string }
  | { type: 'h'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
> {
  const lines = (input || '').replace(/\r\n?/g, '\n').split('\n');
  const blocks: Array<
    { type: 'p'; text: string } | { type: 'img'; src: string; alt?: string; title?: string } | { type: 'h'; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  > = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join('\n') });
      para = [];
    }
  };
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim() === '') {
      flush();
      continue;
    }
    const md = line.match(mdImgRegex);
    if (md) {
      flush();
      const alt = (md[1] || '').trim();
      const src = (md[2] || '').trim();
      const title = (md[3] || '').trim();
      if (src) blocks.push({ type: 'img', src, alt, title });
      continue;
    }
    const mh = line.match(mdHeadingRegex);
    if (mh) {
      flush();
      const level = Math.min(Math.max(mh[1].length, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const text = (mh[2] || '').trim();
      blocks.push({ type: 'h', level, text });
      continue;
    }
    if (line.indexOf(' ') === -1 && isImageUrl(line)) {
      flush();
      blocks.push({ type: 'img', src: line.trim() });
      continue;
    }
    para.push(rawLine);
  }
  flush();
  return blocks;
}

function blocksToHTML(blocks: ReturnType<typeof parseContentToBlocks>): string {
  // Create block-level divs so caret/enter works predictably
  const html = blocks
    .map((b) => {
      if (b.type === 'img') {
        const alt = esc(b.alt || '');
        const src = esc(b.src);
        // Use a consistent image size (thumbnail) but keep responsive width constraints
        return (
          `<div data-block="img" class="rc-block rc-img my-2">` +
          `<img src="${src}" alt="${alt}" class="inline-block h-16 max-w-[50%] rounded border border-border bg-muted align-middle" />` +
          `</div>`
        );
      }
      if (b.type === 'h') {
        const lvl = b.level;
        const text = esc(b.text).replace(/\n/g, ' ');
        const cls = lvl <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : lvl === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
        const lvlAttr = ` data-level="${lvl}"`;
        return `<div data-block="h"${lvlAttr} class="rc-block rc-h ${cls}">${text || '<br>'}</div>`;
      }
      // paragraphs: keep line breaks with <br>
      const text = esc(b.text).replace(/\n/g, '<br>');
      return `<div data-block="p" class="rc-block rc-p whitespace-pre-wrap">${text || '<br>'}</div>`;
    })
    .join('');
  return html || '<div data-block="p" class="rc-block rc-p whitespace-pre-wrap"><br></div>';
}

function serializeHTMLToValue(root: HTMLElement): string {
  const out: string[] = [];
  const children = Array.from(root.children) as HTMLElement[];
  for (const el of children) {
    const kind = el.getAttribute('data-block');
    if (kind === 'img') {
      const img = el.querySelector('img') as HTMLImageElement | null;
      if (img && img.getAttribute('src')) {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        out.push(`![${alt}](${src})`);
      }
      continue;
    }
    if (kind === 'h') {
      const lvlStr = el.getAttribute('data-level') || '2';
      let lvl = parseInt(lvlStr, 10);
      if (!(lvl >= 1 && lvl <= 6)) lvl = 2;
      const hashes = '#'.repeat(lvl);
      const text = (el as HTMLElement).innerText.replace(/\u00A0/g, ' ').trim();
      out.push(`${hashes} ${text}`);
      continue;
    }
    // paragraph
    const text = (el as HTMLElement).innerText.replace(/\u00A0/g, ' '); // replace nbsp
    out.push(text);
  }
  // Separate blocks by blank line
  return out.join('\n\n').replace(/\n{3,}/g, '\n\n');
}

export const ContentEditor = React.forwardRef<ContentEditorHandle, ContentEditorProps>(
  function ContentEditor({ id, value, onChange, placeholder, className, style, onFormatStateChange }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastExternalValue = useRef<string>('');
    const isComposingRef = useRef(false);
    const lastHeadingLevelRef = useRef<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

    const computeCurrentHeadingLevel = (): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
      const el = containerRef.current;
      if (!el) return 0;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return 0;
      let node: Node | null = sel.anchorNode;
      while (node && node !== el) {
        if (node instanceof HTMLElement && node.classList.contains('rc-block')) {
          const kind = node.getAttribute('data-block');
          if (kind === 'h') {
            const lvlStr = node.getAttribute('data-level') || '0';
            const lvl = parseInt(lvlStr, 10);
            if (lvl >= 1 && lvl <= 6) return lvl as 1 | 2 | 3 | 4 | 5 | 6;
          }
          break;
        }
        node = node.parentNode;
      }
      return 0;
    };

    const emitFormatState = () => {
      if (!onFormatStateChange) return;
      const lvl = computeCurrentHeadingLevel();
      if (lastHeadingLevelRef.current !== lvl) {
        lastHeadingLevelRef.current = lvl;
        onFormatStateChange({ headingLevel: lvl });
      }
    };

    // Render blocks to HTML when external value changes
    useEffect(() => {
      if (!containerRef.current) return;
      if (value === lastExternalValue.current) return; // no external change
      const blocks = parseContentToBlocks(value);
      const html = blocksToHTML(blocks);
      const el = containerRef.current;
      // Preserve scroll position
      const { scrollTop } = el;
      el.innerHTML = html;
      el.scrollTop = scrollTop;
      lastExternalValue.current = value;
      emitFormatState();
    }, [value]);

    // Emit change on input
    const handleInput = () => {
      if (!containerRef.current) return;
      const next = serializeHTMLToValue(containerRef.current);
      lastExternalValue.current = next; // mark as our own emission
      onChange(next);
      emitFormatState();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      // Insert plain text at caret
      document.execCommand('insertText', false, text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      if (e.key === 'Enter') {
        // Shift+Enter => soft line break
        if (e.shiftKey) {
          e.preventDefault();
          document.execCommand('insertHTML', false, '<br>');
          // Ensure there is at least one character so caret stays visible
          handleInput();
          return;
        }
        // Enter => create a new paragraph block after the current block
        e.preventDefault();
        const sel = window.getSelection();
        let anchorBlock: HTMLElement | null = null;
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          let node: Node | null = range.startContainer;
          while (node && node !== el) {
            if (node instanceof HTMLElement && node.classList.contains('rc-block')) {
              anchorBlock = node;
              break;
            }
            node = node.parentNode;
          }
        }
        const p = document.createElement('div');
        p.setAttribute('data-block', 'p');
        p.className = 'rc-block rc-p whitespace-pre-wrap';
        p.innerHTML = '<br>';
        if (anchorBlock && anchorBlock.parentElement) {
          anchorBlock.parentElement.insertBefore(p, anchorBlock.nextSibling);
        } else {
          el.appendChild(p);
        }
        // Move caret into the new paragraph
        const range = document.createRange();
        range.selectNodeContents(p);
        range.collapse(true);
        const sel2 = window.getSelection();
        sel2?.removeAllRanges();
        sel2?.addRange(range);
        handleInput();
      }
    };

    const handleCompositionStart = () => { isComposingRef.current = true; };
    const handleCompositionEnd = () => { isComposingRef.current = false; handleInput(); };

    useImperativeHandle(ref, () => ({
      insertImageBlocks(images) {
        const el = containerRef.current;
        if (!el || !images.length) return;
        const sel = window.getSelection();
        let anchorBlock: HTMLElement | null = null;
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          let node: Node | null = range.startContainer;
          while (node && node !== el) {
            if (node instanceof HTMLElement && node.classList.contains('rc-block')) {
              anchorBlock = node;
              break;
            }
            node = node.parentNode;
          }
        }
        // Build fragment
        const frag = document.createDocumentFragment();
        for (const img of images) {
          const wrapper = document.createElement('div');
          wrapper.setAttribute('data-block', 'img');
          wrapper.className = 'rc-block rc-img my-2';
          const imageEl = document.createElement('img');
          imageEl.src = img.src;
          if (img.alt) imageEl.alt = img.alt;
          imageEl.className = 'inline-block h-16 max-w-[50%] rounded border border-border bg-muted align-middle';
          wrapper.appendChild(imageEl);
          frag.appendChild(wrapper);
        }
        // Insert after anchor block or append
        if (anchorBlock && anchorBlock.parentElement) {
          const parent = anchorBlock.parentElement;
          const nextSibling = anchorBlock.nextSibling;
          parent.insertBefore(frag, nextSibling);
        } else {
          el.appendChild(frag);
        }
        // Ensure there is at least one empty paragraph after images for caret
        const lastChild = el.lastElementChild as HTMLElement | null;
        if (!lastChild || lastChild.getAttribute('data-block') === 'img') {
          const p = document.createElement('div');
          p.setAttribute('data-block', 'p');
          p.className = 'rc-block rc-p whitespace-pre-wrap';
          p.innerHTML = '<br>';
          el.appendChild(p);
        }
        // Move caret to end
        const range = document.createRange();
        const endNode = el.lastChild as Node;
        range.selectNodeContents(endNode);
        range.collapse(false);
        const sel2 = window.getSelection();
        sel2?.removeAllRanges();
        sel2?.addRange(range);
        handleInput();
      },
      toggleHeading(level) {
        const el = containerRef.current;
        if (!el) return;
        const sel = window.getSelection();
        let anchorBlock: HTMLElement | null = null;
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          let node: Node | null = range.startContainer;
          while (node && node !== el) {
            if (node instanceof HTMLElement && node.classList.contains('rc-block')) {
              anchorBlock = node as HTMLElement;
              break;
            }
            node = node.parentNode;
          }
        }
        if (!anchorBlock) {
          // if nothing selected, append a new heading block at end
          const h = document.createElement('div');
          h.setAttribute('data-block', 'h');
          h.setAttribute('data-level', String(level));
          const cls = level <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : level === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
          h.className = `rc-block rc-h ${cls}`;
          h.innerHTML = '<br>';
          el.appendChild(h);
          const p = document.createElement('div');
          p.setAttribute('data-block', 'p');
          p.className = 'rc-block rc-p whitespace-pre-wrap';
          p.innerHTML = '<br>';
          el.appendChild(p);
          const range = document.createRange();
          range.selectNodeContents(h);
          range.collapse(true);
          const sel2 = window.getSelection();
          sel2?.removeAllRanges();
          sel2?.addRange(range);
          handleInput();
          return;
        }
        const kind = anchorBlock.getAttribute('data-block');
        if (kind === 'h') {
          const currentLevel = parseInt(anchorBlock.getAttribute('data-level') || '2', 10);
          if (currentLevel === level) {
            // toggle off -> paragraph
            anchorBlock.setAttribute('data-block', 'p');
            anchorBlock.removeAttribute('data-level');
            anchorBlock.className = 'rc-block rc-p whitespace-pre-wrap';
          } else {
            // change heading level
            anchorBlock.setAttribute('data-level', String(level));
            const cls = level <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : level === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
            anchorBlock.className = `rc-block rc-h ${cls}`;
          }
        } else {
          // paragraph -> heading
          anchorBlock.setAttribute('data-block', 'h');
          anchorBlock.setAttribute('data-level', String(level));
          const cls = level <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : level === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
          anchorBlock.className = `rc-block rc-h ${cls}`;
        }
        // Move caret to end of the block
        const range = document.createRange();
        range.selectNodeContents(anchorBlock);
        range.collapse(false);
        const sel2 = window.getSelection();
        sel2?.removeAllRanges();
        sel2?.addRange(range);
        handleInput();
      },
      focus() {
        containerRef.current?.focus();
      },
    }));

    // Initial render
    const initialHTML = useMemo(() => blocksToHTML(parseContentToBlocks(value || '')), []);

    // Listen to selection changes to update format state
    useEffect(() => {
      const onSelChange = () => {
        const el = containerRef.current;
        const sel = window.getSelection();
        if (!el || !sel || sel.rangeCount === 0) return;
        const node = sel.anchorNode as Node | null;
        if (node && el.contains(node)) {
          emitFormatState();
        }
      };
      document.addEventListener('selectionchange', onSelChange);
      // initial emit
      emitFormatState();
      return () => {
        document.removeEventListener('selectionchange', onSelChange);
      };
    }, []);

    return (
      <div className="relative">
        <div
          id={id}
          ref={containerRef}
          className={
            // Copy the Textarea styles for a consistent look (tuned for contentEditable)
            (
              'resize-none border-input focus-visible:border-ring focus-visible:ring-ring/50 ' +
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 ' +
              'block min-h-64 w-full rounded-md border bg-input-background px-3 py-2 text-base ' +
              'transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm '
            ) + (className ? ` ${className}` : '')
          }
          contentEditable
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder || ''}
          onInput={() => !isComposingRef.current && handleInput()}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          // We don't want React to blow away selection on each render; set initial HTML only once
          dangerouslySetInnerHTML={{ __html: initialHTML }}
          style={{ whiteSpace: 'pre-wrap', ...(style || {}) }}
        />
        {/* Placeholder */}
        <div
          className="pointer-events-none absolute left-3 top-2 select-none text-muted-foreground"
          style={{ display: value?.trim() ? 'none' : 'block' }}
        >
          {placeholder}
        </div>
      </div>
    );
  }
);

export default ContentEditor;
