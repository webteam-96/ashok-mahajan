'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export const dynamic = 'force-dynamic';

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #d0d5dd',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#333',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#444',
  marginBottom: '6px',
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface PostFormData {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedDate: string;
  author: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    category: 'blog',
    content: '',
    excerpt: '',
    featuredImage: '',
    publishedDate: new Date().toISOString().split('T')[0],
    author: 'Ashok Mahajan',
    published: true,
    seoTitle: '',
    seoDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          setError('Post not found');
          return;
        }
        const post = await res.json();
        setFormData({
          title: post.title ?? '',
          slug: post.slug ?? '',
          category: post.category ?? 'blog',
          content: post.content ?? '',
          excerpt: post.excerpt ?? '',
          featuredImage: post.featuredImage ?? '',
          publishedDate: post.publishedDate
            ? new Date(post.publishedDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          author: post.author ?? 'Ashok Mahajan',
          published: post.published ?? true,
          seoTitle: post.seoTitle ?? '',
          seoDescription: post.seoDescription ?? '',
        });
        setSlugManuallyEdited(true); // Prevent auto-override on load
      } catch {
        setError('Failed to load post');
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  // Auto slug only if not manually edited (not on initial load)
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, slugManuallyEdited]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedDate: formData.publishedDate
            ? new Date(formData.publishedDate).toISOString()
            : new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Failed to update post');
      } else {
        setSuccess('Post updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _delete: true }) });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? 'Failed to delete post');
        setDeleting(false);
      } else {
        router.push('/admin/posts');
      }
    } catch {
      setError('Network error. Please try again.');
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <div style={{ padding: '32px', color: '#666' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Header */}
      <div
        style={{
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/admin/posts"
            style={{
              fontSize: '14px',
              color: '#666',
              textDecoration: 'none',
            }}
          >
            ← Back
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#000f2b', margin: 0 }}>
            Edit Post
          </h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '8px 16px',
            background: deleting ? '#ffd0d0' : '#fff0f0',
            color: '#cc0000',
            border: '1px solid #ffaaaa',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: deleting ? 'not-allowed' : 'pointer',
          }}
        >
          {deleting ? 'Deleting...' : 'Delete Post'}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: '#fff0f0',
            border: '1px solid #ffcccc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#cc0000',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: '#f0fff0',
            border: '1px solid #9dca00',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#2e7d00',
            fontSize: '14px',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title + Slug */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #eaeaea',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <label style={LABEL_STYLE} htmlFor="title">
                  Title <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Post title"
                  style={{ ...INPUT_STYLE, fontSize: '16px', fontWeight: '600' }}
                />
              </div>
              <div>
                <label style={LABEL_STYLE} htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="post-url-slug"
                  style={INPUT_STYLE}
                />
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #eaeaea',
              }}
            >
              <label style={LABEL_STYLE}>
                Content <span style={{ color: 'red' }}>*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Write your post content here..."
                minHeight="400px"
              />
            </div>

            {/* Excerpt */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #eaeaea',
              }}
            >
              <label style={LABEL_STYLE} htmlFor="excerpt">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
              />
            </div>

            {/* SEO */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #eaeaea',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000f2b',
                  margin: '0 0 16px',
                }}
              >
                SEO Settings
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={LABEL_STYLE} htmlFor="seoTitle">
                  SEO Title
                </label>
                <input
                  id="seoTitle"
                  name="seoTitle"
                  type="text"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <label style={LABEL_STYLE} htmlFor="seoDescription">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Publish settings */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #eaeaea',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000f2b',
                  margin: '0 0 16px',
                }}
              >
                Publish Settings
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={LABEL_STYLE} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={INPUT_STYLE}
                >
                  <option value="blog">Blog</option>
                  <option value="covid-india-task-force">Covid India Task Force</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={LABEL_STYLE} htmlFor="publishedDate">
                  Published Date
                </label>
                <input
                  id="publishedDate"
                  name="publishedDate"
                  type="date"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  style={INPUT_STYLE}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={LABEL_STYLE} htmlFor="author">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  style={INPUT_STYLE}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="published"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    cursor: 'pointer',
                  }}
                >
                  Published
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? '#b8d96e' : '#9dca00',
                  color: '#000f2b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Featured Image */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #eaeaea',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000f2b',
                  margin: '0 0 16px',
                }}
              >
                Featured Image
              </h3>
              <label style={LABEL_STYLE} htmlFor="featuredImage">
                Image URL
              </label>
              <input
                id="featuredImage"
                name="featuredImage"
                type="text"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://... or /uploads/..."
                style={{ ...INPUT_STYLE, marginBottom: '10px' }}
              />
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #eaeaea',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
