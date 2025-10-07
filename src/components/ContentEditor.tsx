import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

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
  imageClassName?: string; // optional: control thumbnail size in editor
  toolbarMode?: 'none' | 'floating'; // optional: built-in floating toolbar
  toolbarOffsetTop?: number; // px offset for sticky positioning of the toolbar (default 12)
  toolbarHideWhenVisibleSelector?: string; // CSS selector of elements; hide floating toolbar when any is visible in viewport
}

// Utility: escape HTML
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Reuse the same minimal markdown we already support in RichContent
const mdImgRegex = /^!\[(.*?)]\((\S+?)(?:\s+"([^"]+)")?\)$/; // ![alt](url "title")
const mdHeadingRegex = /^(#{1,6})\s+(.*)$/; // # Heading

// Default class for image thumbnails in the editor (kept small for non-admin usages)
const DEFAULT_IMG_CLASS = 'inline-block h-16 max-w-[50%] rounded border border-border bg-muted align-middle';

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

function blocksToHTML(blocks: ReturnType<typeof parseContentToBlocks>, opts?: { imageClassName?: string }): string {
  // Create block-level divs so caret/enter works predictably
  const imgClass = opts?.imageClassName || DEFAULT_IMG_CLASS;
  const html = blocks
    .map((b) => {
      if (b.type === 'img') {
        const alt = esc(b.alt || '');
        const src = esc(b.src);
        // Use a consistent image size (thumbnail) but keep responsive width constraints
        return (
          `<div data-block="img" class="rc-block rc-img my-2">` +
          `<img src="${src}" alt="${alt}" class="${imgClass}" />` +
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
  function ContentEditor({ id, value, onChange, placeholder, className, style, onFormatStateChange, imageClassName, toolbarMode = 'floating', toolbarOffsetTop = 64, toolbarHideWhenVisibleSelector }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const lastExternalValue = useRef<string>('');
    const isComposingRef = useRef(false);
    const lastHeadingLevelRef = useRef<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const beforeInputHandledRef = useRef(false);
    const pendingEnterAfterCompositionRef = useRef(false);
        const [headingLevel, setHeadingLevel] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

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
      const lvl = computeCurrentHeadingLevel();
      if (lastHeadingLevelRef.current !== lvl) {
        lastHeadingLevelRef.current = lvl;
        setHeadingLevel(lvl);
        if (onFormatStateChange) onFormatStateChange({ headingLevel: lvl });
      }
    };

    // Render blocks to HTML when external value changes
    useEffect(() => {
      if (!containerRef.current) return;
      if (value === lastExternalValue.current) return; // no external change
      const blocks = parseContentToBlocks(value);
      const html = blocksToHTML(blocks, { imageClassName });
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

    // Insert a soft <br> at current caret (Shift+Enter behavior)
    const insertSoftBreakAtCaret = () => {
      const el = containerRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!range.collapsed) range.deleteContents();
      const br = document.createElement('br');
      range.insertNode(br);
      // move caret after <br>
      range.setStartAfter(br);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      handleInput();
    };

    // Reusable helper: split current block at caret and move the right part to a new paragraph
    const performSplitAtCaret = () => {
      const el = containerRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      // If some text is selected, delete it first to collapse the range
      if (!range.collapsed) {
        range.deleteContents();
      }

      // Find the current rc-block element, including root-boundary cases
      let anchorBlock: HTMLElement | null = null;

      // Case A: selection container is the editor root (caret at a block boundary)
      if (range.startContainer === el) {
        const idx = Math.max(0, Math.min(range.startOffset, el.childNodes.length));
        // Insert a new empty paragraph exactly at the boundary index
        const p = document.createElement('div');
        p.setAttribute('data-block', 'p');
        p.className = 'rc-block rc-p whitespace-pre-wrap';
        p.innerHTML = '<br>';
        const refNode = el.childNodes[idx] || null;
        el.insertBefore(p, refNode);
        const r = document.createRange();
        r.selectNodeContents(p);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        handleInput();
        return;
      }

      // Case B: normal — walk up from startContainer
      if (!anchorBlock) {
        let node: Node | null = range.startContainer;
        while (node && node !== el) {
          if (node instanceof HTMLElement && node.classList.contains('rc-block')) {
            anchorBlock = node;
            break;
          }
          node = node.parentNode;
        }
      }

      // If still nothing, create a paragraph at end and focus it
      if (!anchorBlock) {
        const p = document.createElement('div');
        p.setAttribute('data-block', 'p');
        p.className = 'rc-block rc-p whitespace-pre-wrap';
        p.innerHTML = '<br>';
        el.appendChild(p);
        const r = document.createRange();
        r.selectNodeContents(p);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        handleInput();
        return;
      }

      const kind = anchorBlock.getAttribute('data-block');

      // If on an image block, insert a new paragraph below the image
      if (kind === 'img') {
        const p = document.createElement('div');
        p.setAttribute('data-block', 'p');
        p.className = 'rc-block rc-p whitespace-pre-wrap';
        p.innerHTML = '<br>';
        anchorBlock.parentElement!.insertBefore(p, anchorBlock.nextSibling);
        const r = document.createRange();
        r.selectNodeContents(p);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        handleInput();
        return;
      }

      // If caret is logically at the very end of the anchor block (or at a root boundary after it),
      // we still want to create an empty paragraph after it.
      const atEndOfAnchor =
        (() => {
          const test = document.createRange();
          test.selectNodeContents(anchorBlock);
          test.collapse(false);
          return range.compareBoundaryPoints(Range.START_TO_START, test) === 0;
        })();

      // Split the current block at the caret (extract the right side)
      const rightRange = document.createRange();
      rightRange.setStart(range.startContainer, range.startOffset);
      rightRange.setEnd(anchorBlock, anchorBlock.childNodes.length);
      const rightFrag = rightRange.extractContents();

      // Ensure left block isn't empty (keep a <br> so caret stays visible)
      if (!anchorBlock.textContent || anchorBlock.innerHTML.trim() === '') {
        anchorBlock.innerHTML = '<br>';
      }

      // Create the new block; for headings, the next line becomes a paragraph
      const newBlock = document.createElement('div');
      newBlock.setAttribute('data-block', 'p');
      newBlock.className = 'rc-block rc-p whitespace-pre-wrap';
      if (rightFrag.childNodes.length === 0 || atEndOfAnchor) {
        newBlock.innerHTML = '<br>';
      } else {
        newBlock.appendChild(rightFrag);
      }

      // Insert the new block after the current one
      anchorBlock.parentElement!.insertBefore(newBlock, anchorBlock.nextSibling);

      // Move caret to the start of the new block
      const newRange = document.createRange();
      newRange.selectNodeContents(newBlock);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      handleInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      // Keyboard shortcuts: Ctrl/Cmd+2/3 for H2/H3, Ctrl/Cmd+Shift+I for Add image
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && !e.altKey) {
        if (!e.shiftKey && (e.key === '2' || e.key === '3')) {
          e.preventDefault();
          applyToggleHeading(e.key === '2' ? 2 : 3);
          return;
        }
        if (e.shiftKey && e.key.toLowerCase() === 'i') {
          e.preventDefault();
          fileInputRef.current?.click();
          return;
        }
      }
      if (e.key === 'Enter') {
        // If IME composition is active, queue the split until composition ends
        // @ts-ignore
        if ((e as any).nativeEvent?.isComposing || isComposingRef.current) {
          e.preventDefault();
          pendingEnterAfterCompositionRef.current = true;
          return;
        }
        // Prefer handling in beforeinput; let it preventDefault there.
        if (beforeInputHandledRef.current) {
          return;
        }
        if (e.shiftKey) {
          // Shift+Enter → handled in onBeforeInput as insertLineBreak
          return;
        }
        // Plain Enter → handled in onBeforeInput as insertParagraph
        return;
      }
    };

    const handleCompositionStart = () => { isComposingRef.current = true; };
    const handleCompositionEnd = () => { 
      isComposingRef.current = false; 
      if (pendingEnterAfterCompositionRef.current) {
        pendingEnterAfterCompositionRef.current = false;
        performSplitAtCaret();
        return; // performSplitAtCaret triggers handleInput()
      }
      handleInput(); 
    };

        // Helpers reused by toolbar and imperative API
        const applyInsertImageBlocks = (images: Array<{ src: string; alt?: string }>) => {
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
          const frag = document.createDocumentFragment();
          for (const img of images) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('data-block', 'img');
            wrapper.className = 'rc-block rc-img my-2';
            const imageEl = document.createElement('img');
            imageEl.src = img.src;
            if (img.alt) imageEl.alt = img.alt;
            imageEl.className = imageClassName || DEFAULT_IMG_CLASS;
            wrapper.appendChild(imageEl);
            frag.appendChild(wrapper);
          }
          if (anchorBlock && anchorBlock.parentElement) {
            const parent = anchorBlock.parentElement;
            const nextSibling = anchorBlock.nextSibling;
            parent.insertBefore(frag, nextSibling);
          } else {
            el.appendChild(frag);
          }
          const lastChild = el.lastElementChild as HTMLElement | null;
          if (!lastChild || lastChild.getAttribute('data-block') === 'img') {
            const p = document.createElement('div');
            p.setAttribute('data-block', 'p');
            p.className = 'rc-block rc-p whitespace-pre-wrap';
            p.innerHTML = '<br>';
            el.appendChild(p);
          }
          const range = document.createRange();
          const endNode = el.lastChild as Node;
          range.selectNodeContents(endNode);
          range.collapse(false);
          const sel2 = window.getSelection();
          sel2?.removeAllRanges();
          sel2?.addRange(range);
          handleInput();
        };

        const applyToggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
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
              anchorBlock.setAttribute('data-block', 'p');
              anchorBlock.removeAttribute('data-level');
              anchorBlock.className = 'rc-block rc-p whitespace-pre-wrap';
            } else {
              anchorBlock.setAttribute('data-level', String(level));
              const cls = level <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : level === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
              anchorBlock.className = `rc-block rc-h ${cls}`;
            }
          } else {
            anchorBlock.setAttribute('data-block', 'h');
            anchorBlock.setAttribute('data-level', String(level));
            const cls = level <= 2 ? 'text-2xl font-semibold mt-4 mb-2' : level === 3 ? 'text-xl font-semibold mt-3 mb-1.5' : 'text-lg font-semibold mt-2 mb-1';
            anchorBlock.className = `rc-block rc-h ${cls}`;
          }
          const range = document.createRange();
          range.selectNodeContents(anchorBlock);
          range.collapse(false);
          const sel2 = window.getSelection();
          sel2?.removeAllRanges();
          sel2?.addRange(range);
          handleInput();
        };

    useImperativeHandle(ref, () => ({
      insertImageBlocks: applyInsertImageBlocks,
      toggleHeading: applyToggleHeading,
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

    // Manage floating toolbar visibility based on external static controls visibility
    const [showFloating, setShowFloating] = useState(true);
    useEffect(() => {
      if (toolbarMode !== 'floating') { setShowFloating(false); return; }
      if (!toolbarHideWhenVisibleSelector) { setShowFloating(true); return; }
      const targets = Array.from(document.querySelectorAll(toolbarHideWhenVisibleSelector)) as Element[];
      if (targets.length === 0) { setShowFloating(true); return; }
      const vis = new Map<Element, boolean>();
      const recompute = () => {
        const anyVisible = Array.from(vis.values()).some(Boolean);
        setShowFloating(!anyVisible);
      };
      const observer = new IntersectionObserver((entries) => {
        for (const en of entries) {
          vis.set(en.target, en.isIntersecting && en.intersectionRatio > 0);
        }
        recompute();
      }, { root: null, threshold: [0, 0.01] });
      targets.forEach(t => { vis.set(t, false); observer.observe(t); });
      recompute();
      return () => observer.disconnect();
    }, [toolbarHideWhenVisibleSelector, toolbarMode]);

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
          onBeforeInput={(e) => {
            const ne = (e as unknown as React.FormEvent<HTMLDivElement> & { nativeEvent: InputEvent }).nativeEvent as InputEvent & { inputType?: string };
            const inputType = (ne && (ne as any).inputType) || '';
            if (inputType === 'insertLineBreak') {
              e.preventDefault();
              beforeInputHandledRef.current = true;
              insertSoftBreakAtCaret();
              setTimeout(() => { beforeInputHandledRef.current = false; }, 0);
              return;
            }
            if (inputType === 'insertParagraph') {
              e.preventDefault();
              beforeInputHandledRef.current = true;
              performSplitAtCaret();
              setTimeout(() => { beforeInputHandledRef.current = false; }, 0);
              return;
            }
          }}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          // We don't want React to blow away selection on each render; set initial HTML only once
          dangerouslySetInnerHTML={{ __html: initialHTML }}
          style={{ whiteSpace: 'pre-wrap', ...(style || {}) }}
        />
        {toolbarMode === 'floating' && showFloating && (
          <div className="absolute inset-y-0 right-0 z-20">
            <div className="sticky flex justify-end" style={{ top: toolbarOffsetTop }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  const MAX_SIZE = 5 * 1024 * 1024;
                  const valid = files.filter(f => f.type.startsWith('image/') && f.size <= MAX_SIZE);
                  // Note: invalid type or too-large files are skipped silently here to keep the editor decoupled from toast libs
                  try {
                    const dataUrls = await Promise.all(valid.map(f => new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(String(reader.result || ''));
                      reader.onerror = () => reject(new Error('Failed to read file'));
                      reader.readAsDataURL(f);
                    })));
                    if (dataUrls.length) {
                      applyInsertImageBlocks(dataUrls.map((src, i) => ({ src, alt: valid[i].name })));
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    // Reset input so the same file can be selected again later
                    e.currentTarget.value = '';
                  }
                }}
              />
              <div role="toolbar" aria-label="Editor floating toolbar" className="inline-flex items-center gap-1 rounded-md border border-border bg-input-background/90 backdrop-blur px-1 py-1 shadow-sm w-fit select-none">
                <button
                  type="button"
                  aria-label="Add image"
                  title="Add image (Ctrl+Shift+I)"
                  className="h-8 px-2 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                >
                  {/* Image icon */}
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <path d="M21 15l-5-5L5 21"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Toggle H2"
                  title="H2 (Ctrl+2)"
                  className={`h-8 px-2 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${headingLevel === 2 ? 'bg-accent text-accent-foreground' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyToggleHeading(2);
                  }}
                >
                  H2
                </button>
                <button
                  type="button"
                  aria-label="Toggle H3"
                  title="H3 (Ctrl+3)"
                  className={`h-8 px-2 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${headingLevel === 3 ? 'bg-accent text-accent-foreground' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyToggleHeading(3);
                  }}
                >
                  H3
                </button>
              </div>
            </div>
          </div>
        )}
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
