'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetBody } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

interface Speech {
  id: number;
  title: string;
  slug: string;
  content: string;
  eventName?: string;
  date?: string;
  published: boolean;
  createdAt: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  content: '',
  eventName: '',
  date: new Date().toISOString().split('T')[0],
  published: true,
};

export default function AdminSpeechesPage() {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const fetchSpeeches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/speeches?admin=true');
      const data = await res.json();
      setSpeeches(data.speeches ?? data ?? []);
    } catch {
      setGlobalError('Failed to load speeches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeeches();
  }, [fetchSpeeches]);

  useEffect(() => {
    if (!slugManuallyEdited && !editingId && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, slugManuallyEdited, editingId]);

  function openAdd() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setSlugManuallyEdited(false);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function openEdit(speech: Speech) {
    setEditingId(speech.id);
    setFormData({
      title: speech.title,
      slug: speech.slug,
      content: speech.content,
      eventName: speech.eventName ?? '',
      date: speech.date
        ? new Date(speech.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      published: speech.published,
    });
    setSlugManuallyEdited(true);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.content || formData.content === '<p></p>') {
      setError('Content is required.');
      return;
    }
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const url = editingId ? `/api/speeches/${editingId}` : '/api/speeches';
      const method = editingId ? 'PATCH' : 'POST';
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to save');
      } else {
        setSuccess(editingId ? 'Speech updated!' : 'Speech created!');
        await fetchSpeeches();
        setTimeout(() => {
          setSheetOpen(false);
          setSuccess('');
          setEditingId(null);
          setSlugManuallyEdited(false);
        }, 800);
      }
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
      const res = await fetch(`/api/speeches/${deleteId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _delete: true }) });
      if (!res.ok) {
        const data = await res.json();
        setGlobalError(data.error ?? 'Failed to delete');
      } else {
        await fetchSpeeches();
      }
    } catch {
      setGlobalError('Network error.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold text-heading">Speeches</div>
          <p className="text-slate-500 text-sm mt-0.5">
            {speeches.length} speech{speeches.length !== 1 ? 'es' : ''} total
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={15} />
          Add Speech
        </Button>
      </div>

      {globalError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {globalError}
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : speeches.length === 0 ? (
          <div className="py-16 text-center">
            <Mic size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No speeches yet.</p>
            <Button className="mt-4" onClick={openAdd}>
              <Plus size={15} />
              Add First Speech
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speeches.map((speech) => (
                <TableRow key={speech.id}>
                  <TableCell className="max-w-xs">
                    <div className="font-semibold text-heading truncate" title={speech.title}>
                      {speech.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">/{speech.slug}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate text-slate-500 text-sm">
                      {speech.eventName ?? '-'}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-500 text-sm">
                    {speech.date
                      ? new Date(speech.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={speech.published ? 'success' : 'secondary'}>
                      {speech.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(speech)}>
                        <Pencil size={13} />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(speech.id)}
                      >
                        <Trash2 size={13} />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent open={sheetOpen}>
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Speech' : 'Add New Speech'}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}
            <form id="speech-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Speech title"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="speech-url-slug"
                />
                <p className="text-xs text-slate-400">Auto-generated from title. Editable.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Conference, parliament..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Write the speech content here..."
                  minHeight="280px"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <Checkbox
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />
                <span className="text-sm font-medium text-heading">Published</span>
              </label>
            </form>
          </SheetBody>
          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="speech-form" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Speech' : 'Add Speech'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Speech</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this speech? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
