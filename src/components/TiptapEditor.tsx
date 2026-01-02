import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useCallback, useEffect } from 'react'
import Icon from '@mdi/react'
import {
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatQuoteClose,
  mdiCodeTags,
  mdiUndo,
  mdiRedo,
  mdiImage,
  mdiLink,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
} from '@mdi/js'

type TiptapEditorProps = {
  content: string
  onChange: (content: string) => void
  onImageInsert?: () => void
  placeholder?: string
  className?: string
  pendingImageUrl?: string | null
  onImageInserted?: () => void
}

const MenuBar = ({
  editor,
  onImageInsert,
}: {
  editor: Editor | null
  onImageInsert?: () => void
}) => {
  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
      isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
    }`

  return (
    <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold (Cmd+B)"
      >
        <Icon path={mdiFormatBold} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic (Cmd+I)"
      >
        <Icon path={mdiFormatItalic} size={0.8} />
      </button>
      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Icon path={mdiFormatHeader1} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Icon path={mdiFormatHeader2} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Icon path={mdiFormatHeader3} size={0.8} />
      </button>
      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <Icon path={mdiFormatListBulleted} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <Icon path={mdiFormatListNumbered} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Icon path={mdiFormatQuoteClose} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Icon path={mdiCodeTags} size={0.8} />
      </button>
      <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        type="button"
        onClick={addLink}
        className={buttonClass(editor.isActive('link'))}
        title="Add Link"
      >
        <Icon path={mdiLink} size={0.8} />
      </button>
      <button
        type="button"
        onClick={onImageInsert}
        className={buttonClass(false)}
        title="Insert Image"
      >
        <Icon path={mdiImage} size={0.8} />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={buttonClass(false)}
        title="Undo (Cmd+Z)"
      >
        <Icon path={mdiUndo} size={0.8} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={buttonClass(false)}
        title="Redo (Cmd+Shift+Z)"
      >
        <Icon path={mdiRedo} size={0.8} />
      </button>
    </div>
  )
}

export const TiptapEditor = ({
  content,
  onChange,
  onImageInsert,
  placeholder = 'Start writing...',
  className = '',
  pendingImageUrl,
  onImageInserted,
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
      handleDrop: (_view, event) => {
        const hasFiles =
          event.dataTransfer?.files && event.dataTransfer.files.length > 0
        if (hasFiles) {
          event.preventDefault()
          onImageInsert?.()
          return true
        }
        return false
      },
      handlePaste: (_view, event) => {
        const hasFiles =
          event.clipboardData?.files && event.clipboardData.files.length > 0
        if (hasFiles) {
          event.preventDefault()
          onImageInsert?.()
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (editor && pendingImageUrl) {
      editor.chain().focus().setImage({ src: pendingImageUrl }).run()
      onImageInserted?.()
    }
  }, [pendingImageUrl, editor, onImageInserted])

  return (
    <div
      className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}
    >
      <MenuBar editor={editor} onImageInsert={onImageInsert} />
      <EditorContent editor={editor} />
    </div>
  )
}
