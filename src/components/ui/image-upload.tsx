'use client';

import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  /** aspect ratio for preview, e.g. "aspect-square" or "aspect-video" */
  previewClass?: string;
}

export function ImageUpload({
  value,
  onChange,
  className,
  previewClass = 'aspect-square',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Upload failed');
      } else {
        onChange(data.url);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be selected again
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function clear() {
    onChange('');
    setError('');
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        /* ── Preview ── */
        <div className="relative group rounded-lg overflow-hidden border border-slate-200">
          <img
            src={value}
            alt="Uploaded image"
            className={cn('w-full object-cover', previewClass)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-heading hover:bg-slate-100 transition-colors"
            >
              {uploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              {uploading ? 'Uploading...' : 'Change'}
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          disabled={uploading}
          className={cn(
            'w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50',
            'hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer',
            'text-slate-400 py-8',
            uploading && 'opacity-60 cursor-not-allowed'
          )}
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin text-primary" />
          ) : (
            <ImageIcon size={28} />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-xs mt-0.5">or drag and drop an image here</p>
            <p className="text-xs mt-1 text-slate-300">PNG, JPG, WebP, GIF</p>
          </div>
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
