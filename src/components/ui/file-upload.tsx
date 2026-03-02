'use client';

import { useRef, useState } from 'react';
import { Upload, X, FileText, Music, Video, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** MIME types to accept, e.g. "image/*,application/pdf" — defaults to all allowed types */
  accept?: string;
  className?: string;
}

function getFileCategory(url: string): 'image' | 'audio' | 'video' | 'document' {
  const ext = url.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  return 'document';
}

function getFileName(url: string): string {
  return url.split('/').pop() ?? url;
}

function FileIcon({ category, size = 32 }: { category: ReturnType<typeof getFileCategory>; size?: number }) {
  if (category === 'audio') return <Music size={size} />;
  if (category === 'video') return <Video size={size} />;
  if (category === 'document') return <FileText size={size} />;
  return <File size={size} />;
}

export function FileUpload({ value, onChange, accept, className }: FileUploadProps) {
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
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    onChange('');
    setError('');
  }

  const category = value ? getFileCategory(value) : null;

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          {category === 'image' ? (
            /* Image preview */
            <div className="relative group">
              <img
                src={value}
                alt="Uploaded file"
                className="w-full max-h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-heading hover:bg-slate-100 transition-colors"
                >
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
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
            /* Non-image file row */
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                <FileIcon category={category!} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">{getFileName(value)}</p>
                <p className="text-xs text-slate-400 capitalize">{category}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-heading hover:bg-slate-50 transition-colors"
                >
                  {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
                  {uploading ? 'Uploading...' : 'Change'}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  disabled={uploading}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 bg-white rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={11} />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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
            <Upload size={28} />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-xs mt-0.5">or drag and drop a file here</p>
            <p className="text-xs mt-1 text-slate-300">Images, PDF, Word, Excel, Audio, Video</p>
          </div>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,audio/mpeg,audio/wav,audio/ogg,video/mp4,video/webm'}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
