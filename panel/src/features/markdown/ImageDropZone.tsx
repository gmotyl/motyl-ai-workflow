import { useState, type ReactNode, type DragEvent } from "react";
import { ImagePlus } from "lucide-react";

interface ImageDropZoneProps {
  children: ReactNode;
  targetMarkdown: string; // relative path to current markdown file
  onImageInserted?: (markdownRef: string) => void;
}

export default function ImageDropZone({ children, targetMarkdown, onImageInserted }: ImageDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("targetMarkdown", targetMarkdown);

    try {
      const res = await fetch("/api/images/optimize", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.markdownRef);
        setToast(`Image saved (${data.sizeKB}KB) — markdown copied to clipboard`);
        onImageInserted?.(data.markdownRef);
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast("Image optimization failed");
      setTimeout(() => setToast(null), 3000);
    }
    setUploading(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {children}

      {/* Drag overlay */}
      {dragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <ImagePlus className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-400 font-medium">Drop image to optimize &amp; insert</p>
          </div>
        </div>
      )}

      {/* Upload indicator */}
      {uploading && (
        <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center z-50">
          <p className="text-zinc-300">Optimizing image...</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
