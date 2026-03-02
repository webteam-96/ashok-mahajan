'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect, useRef } from 'react';
import {
  Bold, Italic, List, ListOrdered, Quote,
  Heading2, Heading3, Link2, Minus, Undo2, Redo2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing here...',
  minHeight = '320px',
}: RichTextEditorProps) {
  const initialised = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-body blog-content focus:outline-none',
        style: `min-height: ${minHeight}; padding: 20px 24px;`,
        'data-placeholder': placeholder,
      },
    },
  });

  // Sync content when loaded asynchronously (e.g. edit page fetches post)
  useEffect(() => {
    if (!editor || initialised.current) return;
    if (value && value !== '<p></p>') {
      editor.commands.setContent(value, { emitUpdate: false });
      initialised.current = true;
    }
  }, [value, editor]);

  if (!editor) return null;

  function addLink() {
    const url = window.prompt('Enter URL:');
    if (!url) return;
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  const Btn = ({
    onClick, active, title, children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`flex items-center justify-center w-7 h-7 rounded text-sm transition-colors ${
        active
          ? 'bg-primary/20 text-primary'
          : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-5 bg-slate-300 mx-0.5" />;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-transparent transition-shadow">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50 flex-wrap">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={13} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={13} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule">
          <Minus size={13} />
        </Btn>
        <Sep />
        <Btn onClick={addLink} active={editor.isActive('link')} title="Add link">
          <Link2 size={13} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo (Ctrl+Z)">
          <Undo2 size={13} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo (Ctrl+Y)">
          <Redo2 size={13} />
        </Btn>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
