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
      
      {/* glowing AI Assist Button */}
      <button
        type="button"
        onClick={onAiAssist}
        className="mr-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-black rounded-lg hover:brightness-95 transition flex items-center gap-1.5 shadow-sm select-none"
      >
        <span>✨</span> AI Assist
      </button>
      
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
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [styleProfile, setStyleProfile] = useState("professional");
  const [aiLoading, setAiLoading] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState("");

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

  const handleEnhance = async () => {
    if (!editor) return;
    try {
      setAiLoading(true);
      const res = await databaseService.enhanceStoryAi(editor.getHTML(), styleProfile);
      setEnhancedContent(res.data || res);
    } catch (e) {
      console.error("[AiAssist] Enhancement call failed:", e);
      alert("AI Enhancement failed. Falling back gracefully.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptReplace = () => {
    if (!editor || !enhancedContent) return;
    editor.commands.setContent(enhancedContent);
    setIsAiOpen(false);
    setEnhancedContent("");
  };

  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition">
        <MenuBar 
          editor={editor} 
          onPreview={() => setIsPreviewOpen(true)} 
          onAiAssist={() => setIsAiOpen(true)}
        />
        <EditorContent editor={editor} />
      </div>
      
      <LivePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        content={editor ? editor.getHTML() : ''} 
      />

      {/* Premium AI Assist Diff-Style Overlay Modal */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-brand-navy-dark/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent p-5 border-b border-gray-150 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse select-none">✨</span>
                <div>
                  <h3 className="text-base font-black text-brand-navy-dark tracking-tight">AI Story Enhancement Assistant</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tone optimization, grammar structures, and outcomes accentuation</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAiOpen(false); setEnhancedContent(""); }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold select-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Controls Bar */}
            <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">Stylistic Profile:</span>
                <select
                  value={styleProfile}
                  onChange={(e) => setStyleProfile(e.target.value)}
                  className="text-xs bg-white border border-gray-200 rounded-full py-1.5 px-4 font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="professional">Professional Copywriter (Clear & Strategic)</option>
                  <option value="immersive">Immersive Narrative (Resilience & Compassion)</option>
                  <option value="impact">Impact Focused (Quantified Metrics & Targets)</option>
                  <option value="shorten">Shorten / Condense (Sleek & Concise)</option>
                </select>
              </div>
              <button
                onClick={handleEnhance}
                disabled={aiLoading}
                className="text-xs font-black text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:brightness-95 disabled:opacity-50 px-5 py-2.5 rounded-full transition shadow-sm flex items-center gap-1.5"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Writing Proposal...
                  </>
                ) : (
                  <>
                    <span>🪄</span> Generate Enhanced Draft
                  </>
                )}
              </button>
            </div>

            {/* Comparison Workspace */}
            <div className="flex-1 p-6 overflow-y-auto grid md:grid-cols-2 gap-6 bg-gray-50/20">
              
              {/* Left Column: Original Draft */}
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Current CMS Draft</span>
                <div 
                  className="flex-1 bg-white border border-gray-150 rounded-2xl p-4 prose prose-sm max-w-none text-gray-600 select-none overflow-y-auto max-h-[40vh] md:max-h-full"
                  dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : "" }}
                />
              </div>

              {/* Right Column: AI Proposed Revision */}
              <div className="flex flex-col">
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-2">AI Proposed Proposal (Vetted Revision)</span>
                {aiLoading ? (
                  <div className="flex-1 bg-white border border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl animate-bounce mb-3 select-none">✍️</span>
                    <p className="text-xs font-bold text-indigo-600">Re-shaping vocabulary structures...</p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">Generating GFM paragraphs and styled blockquotes aligned to style targets.</p>
                  </div>
                ) : enhancedContent ? (
                  <div 
                    className="flex-1 bg-gradient-to-br from-indigo-50/50 via-white to-white border border-indigo-150 rounded-2xl p-4 prose prose-sm max-w-none text-gray-700 overflow-y-auto max-h-[40vh] md:max-h-full"
                    dangerouslySetInnerHTML={{ __html: enhancedContent }}
                  />
                ) : (
                  <div className="flex-1 bg-white border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-400 font-medium text-xs">
                    <span className="text-2xl mb-2 select-none">💡</span>
                    No proposal drafted yet. Select a style profile and click "Generate Enhanced Draft".
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-white p-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setIsAiOpen(false); setEnhancedContent(""); }}
                className="px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
              >
                Discard Proposal
              </button>
              <button
                type="button"
                onClick={handleAcceptReplace}
                disabled={!enhancedContent}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-95 disabled:opacity-50 text-white text-xs font-black rounded-full transition shadow-md flex items-center gap-1.5"
              >
                Accept & Replace Content
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default RichTextEditor;
