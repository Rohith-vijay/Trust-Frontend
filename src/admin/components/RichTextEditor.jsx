import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PreviewIcon from '@mui/icons-material/Preview';
import LivePreviewModal from './LivePreviewModal';
import databaseService from '../../services/databaseService';

const MenuBar = ({ editor, onPreview, onAiAssist }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt('URL of the YouTube video:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const buttonClass = (isActive) =>
    `p-2 rounded-md transition text-gray-600 hover:bg-gray-100 ${isActive ? 'bg-primary/10 text-primary font-bold' : ''}`;

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        <FormatBoldIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        <FormatItalicIcon fontSize="small" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
      >
        <FormatListBulletedIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
      >
        <FormatListNumberedIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
      >
        <FormatQuoteIcon fontSize="small" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button type="button" onClick={setLink} className={buttonClass(editor.isActive('link'))}>
        <LinkIcon fontSize="small" />
      </button>
      <button type="button" onClick={addImage} className={buttonClass()}>
        <ImageIcon fontSize="small" />
      </button>
      <button type="button" onClick={addYoutube} className={buttonClass()}>
        <YouTubeIcon fontSize="small" />
      </button>
      
      <div className="flex-1" />
      

      
      <button 
        type="button" 
        onClick={onPreview} 
        className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-lg hover:brightness-95 transition flex items-center gap-1"
      >
        <PreviewIcon fontSize="small" /> Preview
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Youtube.configure({
        width: 480,
        height: 320,
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[180px] p-4 text-gray-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });



  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition">
        <MenuBar 
          editor={editor} 
          onPreview={() => setIsPreviewOpen(true)} 
        />
        <EditorContent editor={editor} />
      </div>
      
      <LivePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        content={editor ? editor.getHTML() : ''} 
      />


    </>
  );
};

export default RichTextEditor;
