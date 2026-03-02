'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Video as VideoIcon } from 'lucide-react';
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

export const dynamic = 'force-dynamic';

interface Video {
  id: number;
  title: string;
  youtubeUrl?: string;
  videoFile?: string;
  thumbnail?: string;
  date?: string;
  published: boolean;
}

function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

const EMPTY_FORM = {
  title: '',
  youtubeUrl: '',
  videoFile: '',
  thumbnail: '',
  date: new Date().toISOString().split('T')[0],
  published: true,
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
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

  const ytThumb = getYouTubeThumbnail(formData.youtubeUrl);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/videos?admin=true');
      const data = await res.json();
      setVideos(data.videos ?? data ?? []);
    } catch {
      setGlobalError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  function openAdd() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function openEdit(video: Video) {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl ?? '',
      videoFile: video.videoFile ?? '',
      thumbnail: video.thumbnail ?? '',
      date: video.date
        ? new Date(video.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      published: video.published,
    });
    setError('');
    setSuccess('');
    setSheetOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const url = editingId ? `/api/videos/${editingId}` : '/api/videos';
      const method = editingId ? 'PATCH' : 'POST';
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        thumbnail: formData.thumbnail || ytThumb || null,
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
        setSuccess(editingId ? 'Video updated!' : 'Video added!');
        await fetchVideos();
        setTimeout(() => {
          setSheetOpen(false);
          setSuccess('');
          setEditingId(null);
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
      const res = await fetch(`/api/videos/${deleteId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _delete: true }) });
      if (!res.ok) {
        const data = await res.json();
        setGlobalError(data.error ?? 'Failed to delete');
      } else {
        await fetchVideos();
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
          <div className="text-2xl font-bold text-heading">Videos</div>
          <p className="text-slate-500 text-sm mt-0.5">
            {videos.length} video{videos.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={15} />
          Add Video
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
        ) : videos.length === 0 ? (
          <div className="py-16 text-center">
            <VideoIcon size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No videos yet.</p>
            <Button className="mt-4" onClick={openAdd}>
              <Plus size={15} />
              Add First Video
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => {
                const thumb =
                  video.thumbnail ||
                  (video.youtubeUrl ? getYouTubeThumbnail(video.youtubeUrl) : null);
                return (
                  <TableRow key={video.id}>
                    <TableCell>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-20 h-11 object-cover rounded border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-11 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                          <VideoIcon size={16} className="text-slate-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-semibold text-heading truncate">{video.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          video.youtubeUrl
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {video.youtubeUrl ? 'YouTube' : video.videoFile ? 'File' : 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-500 text-sm">
                      {video.date
                        ? new Date(video.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={video.published ? 'success' : 'secondary'}>
                        {video.published ? 'Published' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(video)}>
                          <Pencil size={13} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(video.id)}
                        >
                          <Trash2 size={13} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent open={sheetOpen}>
          <SheetHeader>
            <SheetTitle>{editingId ? 'Edit Video' : 'Add New Video'}</SheetTitle>
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
            <form id="video-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Video title"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="videoFile">Video File URL</Label>
                <Input
                  id="videoFile"
                  name="videoFile"
                  value={formData.videoFile}
                  onChange={handleChange}
                  placeholder="/uploads/video.mp4"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="Auto-detected from YouTube URL"
                />
              </div>

              {/* Thumbnail preview */}
              {(formData.thumbnail || ytThumb) && (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={formData.thumbnail || ytThumb!}
                    alt="Thumbnail preview"
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {ytThumb && !formData.thumbnail && (
                    <p className="text-xs text-primary px-3 py-1.5">
                      Auto-detected from YouTube URL
                    </p>
                  )}
                </div>
              )}

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
            <Button type="submit" form="video-form" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
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
