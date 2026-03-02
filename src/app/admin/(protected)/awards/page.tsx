'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, Trophy, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetBody } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/ui/image-upload';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Award {
  id: number;
  title?: string | null;
  image: string;
  year?: number | null;
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

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add mode
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [addYear, setAddYear] = useState<string>(String(new Date().getFullYear()));
  const [addPublished, setAddPublished] = useState(true);

  // Edit mode
  const [editImage, setEditImage] = useState('');
  const [editYear, setEditYear] = useState<string>('');
  const [editPublished, setEditPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/awards?admin=true');
      const data = await res.json();
      setAwards(Array.isArray(data) ? data : (data.awards ?? []));
    } catch {
      setGlobalError('Failed to load awards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAwards(); }, [fetchAwards]);

  function openAdd() {
    setEditingId(null);
    setUploadItems([]);
    setAddYear(String(new Date().getFullYear()));
    setAddPublished(true);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function openEdit(award: Award) {
    setEditingId(award.id);
    setEditImage(award.image);
    setEditYear(award.year ? String(award.year) : '');
    setEditPublished(award.published);
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

  function handleFilePick(files: FileList | null) {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newItems: UploadItem[] = imageFiles.map((f) => ({
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
    if (ready.length === 0) { setError('Upload at least one image first.'); return; }

    setSaving(true); setError(''); setSuccess('');
    try {
      const results = await Promise.all(
        ready.map((item) =>
          fetch('/api/awards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: item.url, year: addYear ? Number(addYear) : null, published: addPublished }),
          })
        )
      );
      if (!results.every((r) => r.ok)) { setError('Some awards failed to save.'); return; }
      setSuccess(`${ready.length} award${ready.length > 1 ? 's' : ''} added!`);
      await fetchAwards();
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
      const res = await fetch(`/api/awards/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: editImage, year: editYear ? Number(editYear) : null, published: editPublished }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save'); return; }
      setSuccess('Award updated!');
      await fetchAwards();
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
      const res = await fetch(`/api/awards/${deleteId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _delete: true }) });
      if (!res.ok) {
        const data = await res.json();
        setGlobalError(data.error ?? 'Failed to delete');
      } else {
        await fetchAwards();
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
          <div className="text-2xl font-bold text-heading">Awards</div>
          <p className="text-slate-500 text-sm mt-0.5">{awards.length} award{awards.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openAdd}><Plus size={15} />Add Awards</Button>
      </div>

      {globalError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{globalError}</div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : awards.length === 0 ? (
          <div className="py-16 text-center">
            <Trophy size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No awards yet.</p>
            <Button className="mt-4" onClick={openAdd}><Plus size={15} />Add First Award</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.map((award) => (
                <TableRow key={award.id}>
                  <TableCell>
                    <img
                      src={award.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{award.year ?? '—'}</TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(award.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={award.published ? 'success' : 'secondary'}>
                      {award.published ? 'Published' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(award)}><Pencil size={13} />Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(award.id)}><Trash2 size={13} />Delete</Button>
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
            <SheetTitle>{editingId ? 'Edit Award' : 'Add Awards'}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

            {editingId ? (
              <form id="award-form" onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Image</Label>
                  <ImageUpload value={editImage} onChange={setEditImage} previewClass="aspect-square max-h-48" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input id="edit-year" type="number" value={editYear} onChange={(e) => setEditYear(e.target.value)} placeholder={String(new Date().getFullYear())} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 w-full">
                  <Checkbox checked={editPublished} onChange={(e) => setEditPublished((e.target as HTMLInputElement).checked)} />
                  <span className="text-sm font-medium text-heading">Published</span>
                </label>
              </form>
            ) : (
              <form id="award-form" onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Images</Label>
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
                      <p className="text-xs mt-0.5 text-slate-300">Select multiple images at once</p>
                    </div>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => { handleFilePick(e.target.files); e.target.value = ''; }} />
                </div>

                {uploadItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadItems.map((item) => (
                      <div key={item.uid} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                        {item.status === 'done' && <img src={item.url} alt="" className="w-full h-full object-cover" />}
                        {item.status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <Loader2 size={20} className="animate-spin text-primary" />
                          </div>
                        )}
                        {item.status === 'error' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-1">
                            <p className="text-red-600 text-[10px] text-center leading-tight">{item.error}</p>
                          </div>
                        )}
                        <button type="button" onClick={() => removeItem(item.uid)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
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

                <div className="space-y-1.5">
                  <Label htmlFor="add-year">Year</Label>
                  <Input id="add-year" type="number" value={addYear} onChange={(e) => setAddYear(e.target.value)} placeholder={String(new Date().getFullYear())} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 w-full">
                  <Checkbox checked={addPublished} onChange={(e) => setAddPublished((e.target as HTMLInputElement).checked)} />
                  <span className="text-sm font-medium text-heading">Published</span>
                </label>
              </form>
            )}
          </SheetBody>
          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" form="award-form" disabled={saving || (!editingId && readyCount === 0)}>
              {saving ? 'Saving…' : editingId ? 'Update Award' : `Add ${readyCount > 0 ? readyCount : ''} Award${readyCount !== 1 ? 's' : ''}`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Award</DialogTitle>
            <DialogDescription>Are you sure you want to delete this award? This action cannot be undone.</DialogDescription>
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
