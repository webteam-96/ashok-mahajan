'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, FolderOpen, FileText, Music, Video, ImageIcon, ExternalLink, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetBody } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface MediaFile {
  id: number;
  file: string;
  fileType: string;
  mimeType?: string;
  published: boolean;
  createdAt: string;
}

interface UploadItem {
  uid: string;
  file: File;
  status: 'uploading' | 'done' | 'error';
  url: string;
  error: string;
}

function getFileCategory(file: string): 'image' | 'audio' | 'video' | 'document' {
  const ext = file.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  return 'document';
}

function FileTypeIcon({ file, size = 16 }: { file: string; size?: number }) {
  const cat = getFileCategory(file);
  if (cat === 'image') return <ImageIcon size={size} className="text-blue-500" />;
  if (cat === 'audio') return <Music size={size} className="text-purple-500" />;
  if (cat === 'video') return <Video size={size} className="text-pink-500" />;
  return <FileText size={size} className="text-amber-500" />;
}

function fileTypeBadge(file: string) {
  const cat = getFileCategory(file);
  const map: Record<string, { label: string; className: string }> = {
    image:    { label: 'Image',    className: 'bg-blue-50 text-blue-700 border-blue-200' },
    audio:    { label: 'Audio',    className: 'bg-purple-50 text-purple-700 border-purple-200' },
    video:    { label: 'Video',    className: 'bg-pink-50 text-pink-700 border-pink-200' },
    document: { label: 'Document', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };
  const { label, className } = map[cat];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${className}`}>
      {label}
    </span>
  );
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add mode
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [addPublished, setAddPublished] = useState(true);

  // Edit mode
  const [editFile, setEditFile] = useState('');
  const [editPublished, setEditPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media?admin=true');
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setGlobalError('Failed to load media files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  function openAdd() {
    setEditingId(null);
    setUploadItems([]);
    setAddPublished(true);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function openEdit(f: MediaFile) {
    setEditingId(f.id);
    setEditFile(f.file);
    setEditPublished(f.published);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Upload failed');
    return data.url as string;
  }

  function handleFilePick(picked: FileList | null) {
    if (!picked || picked.length === 0) return;
    const items = Array.from(picked);

    const newItems: UploadItem[] = items.map((f) => ({
      uid: `${Date.now()}-${Math.random()}`,
      file: f,
      status: 'uploading',
      url: '',
      error: '',
    }));
    setUploadItems((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      uploadFile(item.file)
        .then((url) => setUploadItems((prev) =>
          prev.map((i) => i.uid === item.uid ? { ...i, status: 'done', url } : i)))
        .catch((err) => setUploadItems((prev) =>
          prev.map((i) => i.uid === item.uid ? { ...i, status: 'error', error: err.message } : i)));
    });
  }

  function removeItem(uid: string) {
    setUploadItems((prev) => prev.filter((i) => i.uid !== uid));
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ready = uploadItems.filter((i) => i.status === 'done' && i.url);
    if (ready.length === 0) { setError('Upload at least one file first.'); return; }

    setSaving(true); setError(''); setSuccess('');
    try {
      const results = await Promise.all(
        ready.map((item) =>
          fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: item.url, fileType: getFileCategory(item.url), published: addPublished }),
          })
        )
      );
      if (!results.every((r) => r.ok)) { setError('Some files failed to save.'); return; }
      setSuccess(`${ready.length} file${ready.length > 1 ? 's' : ''} added!`);
      await fetchFiles();
      setTimeout(() => { setSheetOpen(false); setSuccess(''); setUploadItems([]); }, 800);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`/api/media/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: editFile, fileType: getFileCategory(editFile), published: editPublished }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save'); return; }
      setSuccess('File updated!');
      await fetchFiles();
      setTimeout(() => { setSheetOpen(false); setSuccess(''); setEditingId(null); }, 800);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${deleteId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _delete: true }) });
      if (!res.ok) {
        const data = await res.json();
        setGlobalError(data.error ?? 'Failed to delete');
      } else {
        await fetchFiles();
      }
    } catch {
      setGlobalError('Network error.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const uploadingCount = uploadItems.filter((i) => i.status === 'uploading').length;
  const readyCount = uploadItems.filter((i) => i.status === 'done').length;

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold text-heading">Media</div>
          <p className="text-slate-500 text-sm mt-0.5">{files.length} file{files.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openAdd}><Plus size={15} />Upload Files</Button>
      </div>

      {globalError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{globalError}</div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No media files yet.</p>
            <Button className="mt-4" onClick={openAdd}><Plus size={15} />Upload First File</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>
                    {getFileCategory(f.file) === 'image' ? (
                      <img
                        src={f.file}
                        alt=""
                        className="w-10 h-10 object-cover rounded border border-slate-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                        <FileTypeIcon file={f.file} size={18} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {fileTypeBadge(f.file)}
                      <a href={f.file} target="_blank" rel="noopener noreferrer"
                        className="text-slate-400 hover:text-primary transition-colors" title="Open file">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(f.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={f.published ? 'success' : 'secondary'}>
                      {f.published ? 'Published' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(f)}><Pencil size={13} />Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(f.id)}><Trash2 size={13} />Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent open={sheetOpen}>
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit File' : 'Upload Files'}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

            {editingId ? (
              <form id="media-form" onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>File</Label>
                  <FileUpload value={editFile} onChange={setEditFile} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 w-full">
                  <Checkbox checked={editPublished} onChange={(e) => setEditPublished((e.target as HTMLInputElement).checked)} />
                  <span className="text-sm font-medium text-heading">Published</span>
                </label>
              </form>
            ) : (
              <form id="media-form" onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Files</Label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); handleFilePick(e.dataTransfer.files); }}
                    onDragOver={(e) => e.preventDefault()}
                    className={cn(
                      'w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-8',
                      'hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer text-slate-400'
                    )}
                  >
                    <Upload size={28} />
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to select or drag & drop</p>
                      <p className="text-xs mt-0.5 text-slate-300">Images, PDFs, Word, Excel, Audio, Video</p>
                    </div>
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden"
                    onChange={(e) => { handleFilePick(e.target.files); e.target.value = ''; }} />
                </div>

                {uploadItems.length > 0 && (
                  <div className="space-y-2">
                    {uploadItems.map((item) => (
                      <div key={item.uid} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-8 h-8 shrink-0 rounded overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                          {item.status === 'done' && getFileCategory(item.url) === 'image' ? (
                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                          ) : item.status === 'uploading' ? (
                            <Loader2 size={14} className="animate-spin text-primary" />
                          ) : item.status === 'error' ? (
                            <FileText size={14} className="text-red-400" />
                          ) : (
                            <FileTypeIcon file={item.url} size={14} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{item.file.name}</p>
                          {item.status === 'uploading' && <p className="text-xs text-slate-400">Uploading…</p>}
                          {item.status === 'error' && <p className="text-xs text-red-500">{item.error}</p>}
                          {item.status === 'done' && <p className="text-xs text-green-600">Ready</p>}
                        </div>
                        <button type="button" onClick={() => removeItem(item.uid)}
                          className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadItems.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {readyCount} ready{uploadingCount > 0 ? `, ${uploadingCount} uploading…` : ''}
                  </p>
                )}

                <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 w-full">
                  <Checkbox checked={addPublished} onChange={(e) => setAddPublished((e.target as HTMLInputElement).checked)} />
                  <span className="text-sm font-medium text-heading">Published</span>
                </label>
              </form>
            )}
          </SheetBody>
          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" form="media-form" disabled={saving || (!editingId && readyCount === 0)}>
              {saving ? 'Saving…' : editingId ? 'Update File' : `Upload ${readyCount > 0 ? readyCount : ''} File${readyCount !== 1 ? 's' : ''}`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>Are you sure you want to delete this file? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
