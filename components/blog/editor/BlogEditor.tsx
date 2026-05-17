"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      TiptapImage,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: "Commencez à écrire votre article...",
      }),
      TiptapUnderline,
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-deepframe max-w-none min-h-[400px] px-6 py-4 outline-none focus:outline-none",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-df-surface">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
