import { useRef, useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { CharacterCount } from '@tiptap/extension-character-count';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import ImageResize from 'tiptap-extension-resize-image';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, 
  Quote, Undo, Redo, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Link as LinkIcon, Highlighter,
  Save, X, Subscript as SubIcon, Superscript as SuperIcon,
  Table as TableIcon, CheckSquare, Code as CodeIcon,
  FileCode2, TerminalSquare
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

const MenuBar = ({ editor, uploadImage, isHtmlMode, setIsHtmlMode }: { editor: any, uploadImage: (file: File) => Promise<void>, isHtmlMode: boolean, setIsHtmlMode: (v: boolean) => void }) => {
  if (!editor && !isHtmlMode) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await uploadImage(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = () => {
    if (!editor) return;
    const fromPc = window.confirm('Дали сакате да прикачите слика од компјутер (OK) или преку URL (Cancel)?');
    if (fromPc) {
      triggerFileUpload();
    } else {
      const url = window.prompt('Внеси URL на сликата:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const fonts = [
    { name: 'Sans', value: 'Inter' },
    { name: 'Mono', value: 'JetBrains Mono' },
    { name: 'Serif', value: 'serif' },
    { name: 'Head', value: 'Bebas Neue' },
    { name: 'Mont', value: 'Montserrat' },
    { name: 'Cursive', value: 'cursive' },
  ];

  const fontSizes = [
    { name: 'Small', value: '12px' },
    { name: 'Normal', value: '16px' },
    { name: 'Large', value: '20px' },
    { name: 'Huge', value: '32px' },
    { name: 'Giant', value: '48px' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-dark/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl sticky top-24 z-[100] transition-all relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* HTML Mode Toggle */}
      <button
        type="button"
        onClick={() => setIsHtmlMode(!isHtmlMode)}
        className={cn("p-2 px-3 rounded-lg flex items-center gap-2 text-[10px] uppercase font-black tracking-widest border border-white/10 transition-all", isHtmlMode ? "bg-primary text-dark border-primary shadow-lg shadow-primary/20" : "hover:bg-white/5 text-white/50")}
        title="Source Code Mode (HTML)"
      >
        <FileCode2 className="w-4 h-4" />
        {isHtmlMode ? 'Визуелен Едитор' : 'HTML КОД'}
      </button>

      {!isHtmlMode && editor && (
        <>
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <select 
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-primary outline-none cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-all"
              value={editor.getAttributes('textStyle').fontFamily || ''}
            >
              <option value="" className="bg-dark text-white">Font</option>
              {fonts.map(f => (
                <option key={f.value} value={f.value} className="bg-dark text-white">{f.name}</option>
              ))}
            </select>
            
            <select 
              onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-primary outline-none cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-all"
              value={editor.getAttributes('textStyle').fontSize || ''}
            >
              <option value="" className="bg-dark text-white">Size</option>
              {fontSizes.map(f => (
                <option key={f.value} value={f.value} className="bg-dark text-white">{f.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('bold') && "text-primary bg-primary/10")}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('italic') && "text-primary bg-primary/10")}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('underline') && "text-primary bg-primary/10")}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('strike') && "text-primary bg-primary/10")}
              title="Strike"
            >
              <span className="font-bold line-through">S</span>
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            {[1, 2, 3, 4, 5, 6].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-[10px] font-black", 
                  editor.isActive('heading', { level }) ? "text-primary bg-primary/10" : "text-white/40"
                )}
                title={`H${level}`}
              >
                H{level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive({ textAlign: 'left' }) && "text-primary bg-primary/10")}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive({ textAlign: 'center' }) && "text-primary bg-primary/10")}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive({ textAlign: 'right' }) && "text-primary bg-primary/10")}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('bulletList') && "text-primary bg-primary/10")}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('taskList') && "text-primary bg-primary/10")}
              title="Task List"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('blockquote') && "text-primary bg-primary/10")}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('code') && "text-primary bg-primary/10")}
              title="Inline Code"
            >
              <CodeIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('codeBlock') && "text-primary bg-primary/10")}
              title="Code Block"
            >
              <TerminalSquare className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              title="Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={setLink}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('link') && "text-primary bg-primary/10")}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn("p-2 rounded-lg hover:bg-white/5 transition-colors", editor.isActive('highlight') && "text-primary bg-primary/10")}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-20"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-20"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
               const color = window.prompt('Color hex:', '#ffffff');
               if (color) editor.chain().focus().setColor(color).run();
            }}
            className="ml-auto p-2"
          >
            <div 
              className="w-4 h-4 rounded-full border border-white/20 shadow-md shadow-black/50" 
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#fff' }}
            />
          </button>
        </>
      )}
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `editor-uploads/${fileName}`;
      const bucketName = 'media'; 
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      let publicUrl = '';
      if (uploadError) {
        const { error: fallbackError } = await supabase.storage
          .from('post-images')
          .upload(filePath, file);
        if (fallbackError) throw uploadError;
        publicUrl = supabase.storage.from('post-images').getPublicUrl(filePath).data.publicUrl;
      } else {
        publicUrl = supabase.storage.from(bucketName).getPublicUrl(filePath).data.publicUrl;
      }
      
      editor?.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Грешка при поставување на сликата.');
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        code: false,
      }) as any,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-zinc-900 text-zinc-100 p-4 rounded-xl font-mono text-sm shadow-xl shadow-black/20 my-6 border border-zinc-800 overflow-x-auto',
        },
      }) as any,
      Code.configure({
        HTMLAttributes: {
          class: 'bg-zinc-100 text-zinc-900 px-1.5 py-0.5 rounded-md font-mono text-sm border border-zinc-200',
        },
      }) as any,
      Underline as any,
      ImageResize.configure({}) as any,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }) as any,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }) as any,
      Color as any,
      TextStyle as any,
      FontFamily as any,
      Typography as any,
      Subscript as any,
      Superscript as any,
      TaskList as any,
      TaskItem.configure({
        nested: true,
      }) as any,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-fixed w-full my-8 border border-white/10 rounded-xl overflow-hidden',
        }
      }) as any,
      TableRow as any,
      TableHeader as any,
      TableCell as any,
      CharacterCount as any,
      Highlight.configure({ multicolor: true }) as any,
      Placeholder.configure({
        placeholder: 'Почни да пишуваш тука... (Можете да пишувате и код, или да користите HTML формат)',
      }) as any,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLocalContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-zinc max-w-none focus:outline-none min-h-[600px] text-xl leading-relaxed font-medium text-[#232323] p-8 bg-white/50 rounded-2xl shadow-inner border border-black/5 mt-4 custom-scrollbar',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file);
            return true;
          }
        }
        return false;
      }
    },
  });

  // Keep editor content in sync if switched from HTML mode
  useEffect(() => {
    if (!isHtmlMode && editor && localContent !== editor.getHTML()) {
      editor.commands.setContent(localContent, { emitUpdate: false });
    }
  }, [isHtmlMode, editor, localContent]);

  return (
    <div className="relative min-h-[700px] flex flex-col group">
      <MenuBar editor={editor} uploadImage={uploadImage} isHtmlMode={isHtmlMode} setIsHtmlMode={setIsHtmlMode} />
      
      <div className="relative flex-1 flex flex-col transition-all duration-300">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
        
        {isHtmlMode ? (
          <textarea
            value={localContent}
            onChange={(e) => {
              setLocalContent(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full min-h-[600px] bg-dark text-primary/80 font-mono text-sm p-8 rounded-2xl shadow-inner outline-none border border-white/10 focus:border-primary/50 transition-colors custom-scrollbar z-10 mt-4 leading-loose resize-y"
            placeholder="<html>Пишувајте чист HTML код овде...</html>"
            spellCheck="false"
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 overflow-hidden z-10 mt-4">
            <EditorContent editor={editor} className="w-full flex-1" />
          </div>
        )}
        
        {!isHtmlMode && editor && (
          <div className="mt-4 px-2 py-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40 bg-dark rounded-xl px-4 shadow-inner mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {editor.storage.characterCount.characters()} карактери
              </span>
              <span className="text-white/20">|</span>
              <span>{editor.storage.characterCount.words()} зборови</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary hover:text-primary-light transition-colors group/dev flex items-center gap-2 cursor-default">
                <TerminalSquare className="w-4 h-4 opacity-50 group-hover/dev:opacity-100 group-hover/dev:rotate-12 transition-all" />
                Tiptap Editor Studio Pro
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
