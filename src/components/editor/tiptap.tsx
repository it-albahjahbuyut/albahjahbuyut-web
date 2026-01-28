"use client";

import { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
} from "lucide-react";

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function TiptapEditor({
    content,
    onChange,
    placeholder = "Mulai menulis...",
    className,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-green-600 underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] px-4 py-3 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-emerald-500",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Validasi dan update content editor jika berubah dari luar (misal dari AI Generate)
    // Tiptap useEditor tidak otomatis update jika props content berubah setelah inisialisasi
    useEffect(() => {
        if (editor && content) {
            // Cek jika konten berbeda untuk menghindari infinite loop atau reset cursor
            if (editor.getHTML() !== content) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt("Masukkan URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Masukkan URL gambar:");
        if (url) {
            const widthInput = window.prompt("Ukuran gambar (dalam %, misal: 50, 75, 100):", "100");
            const width = widthInput ? `${parseInt(widthInput, 10)}%` : '100%';
            // Insert image with custom width via style
            editor.chain().focus().setImage({ src: url }).run();
            // After inserting, we need to update the image's attributes
            // TipTap's Image extension needs to be configured to support style attribute
            // For now, we'll use a workaround by injecting HTML directly
            const currentHTML = editor.getHTML();
            // Find the last inserted image and add width style
            const updatedHTML = currentHTML.replace(
                new RegExp(`<img src="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*)>`),
                `<img src="${url}" style="width: ${width}; max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;"$1>`
            );
            editor.commands.setContent(updatedHTML);
        }
    };

    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(editor.isActive("bold") && "bg-gray-200")}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(editor.isActive("italic") && "bg-gray-200")}
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(editor.isActive("heading", { level: 1 }) && "bg-gray-200")}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(editor.isActive("heading", { level: 2 }) && "bg-gray-200")}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn(editor.isActive("heading", { level: 3 }) && "bg-gray-200")}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(editor.isActive("bulletList") && "bg-gray-200")}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(editor.isActive("orderedList") && "bg-gray-200")}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(editor.isActive("blockquote") && "bg-gray-200")}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={cn(editor.isActive("link") && "bg-gray-200")}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={addImage}>
                    <ImageIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
