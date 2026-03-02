import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import {
  FileText,
  Mic,
  Trophy,
  Video,
  Images,
  BookOpen,
  FolderOpen,
  PenSquare,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  label: string;
  count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ElementType<any>;
  iconBg: string;
  iconColor: string;
  href: string;
}

function StatCard({ label, count, icon: Icon, iconBg, iconColor, href }: StatCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {label}
              </p>
              <p className="text-3xl font-bold text-heading leading-none">{count}</p>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
              style={{ backgroundColor: iconBg }}
            >
              <Icon size={22} style={{ color: iconColor }} />
            </div>
          </div>
          <p className="text-xs text-primary font-semibold mt-3 group-hover:underline">
            View all →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [posts, speeches, awards, videos, gallery, pubs, media, recentPosts] = await Promise.all([
    prisma.blogPost.count(),
    prisma.speech.count(),
    prisma.award.count(),
    prisma.video.count(),
    prisma.galleryImage.count(),
    prisma.publication.count(),
    prisma.mediaFile.count(),
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        publishedDate: true,
        published: true,
      },
    }),
  ]);

  const stats: StatCardProps[] = [
    {
      label: 'Blog Posts',
      count: posts,
      icon: FileText,
      iconBg: '#dbeafe',
      iconColor: '#1d4ed8',
      href: '/admin/posts',
    },
    {
      label: 'Speeches',
      count: speeches,
      icon: Mic,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      href: '/admin/speeches',
    },
    {
      label: 'Awards',
      count: awards,
      icon: Trophy,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      href: '/admin/awards',
    },
    {
      label: 'Videos',
      count: videos,
      icon: Video,
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      href: '/admin/videos',
    },
    {
      label: 'Gallery',
      count: gallery,
      icon: Images,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      href: '/admin/gallery',
    },
    {
      label: 'Publications',
      count: pubs,
      icon: BookOpen,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      href: '/admin/publications',
    },
    {
      label: 'Media',
      count: media,
      icon: FolderOpen,
      iconBg: '#f0fdf4',
      iconColor: '#15803d',
      href: '/admin/media',
    },
  ];

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/posts/new', icon: PenSquare },
    { label: 'Add Speech', href: '/admin/speeches', icon: Mic },
    { label: 'Add Award', href: '/admin/awards', icon: Trophy },
    { label: 'Upload Video', href: '/admin/videos', icon: Video },
    { label: 'Add Gallery Image', href: '/admin/gallery', icon: Images },
    { label: 'Add Publication', href: '/admin/publications', icon: BookOpen },
    { label: 'Upload Media', href: '/admin/media', icon: FolderOpen },
  ];

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-heading mb-1">Dashboard</div>
        <p className="text-slate-500 text-sm">
          Welcome back! Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <div className="p-5 border-b border-slate-100">
            <div className="text-sm font-semibold text-heading">Quick Actions</div>
          </div>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-heading transition-colors border border-slate-200"
                  >
                    <Icon size={15} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="text-sm font-semibold text-heading">Recent Posts</div>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <CardContent className="p-5">
            {recentPosts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">No posts yet.</p>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-semibold hover:underline"
                >
                  <Plus size={14} />
                  Create first post
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-semibold text-heading hover:text-primary transition-colors block truncate"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {new Date(post.publishedDate).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-slate-200">|</span>
                        <span className="text-xs text-slate-400 capitalize">{post.category}</span>
                      </div>
                    </div>
                    <Badge variant={post.published ? 'success' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
