import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SearchParamsProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminPostsPage({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold text-heading">Blog Posts</div>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} post{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus size={15} />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm mb-4">No blog posts yet.</p>
            <Link href="/admin/posts/new">
              <Button>
                <Plus size={15} />
                Create First Post
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <div className="font-semibold text-heading truncate" title={post.title}>
                      {post.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">/{post.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.category === 'blog' ? 'secondary' : 'outline'}
                      className={
                        post.category === 'blog'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                      }
                    >
                      {post.category === 'covid-india-task-force' ? 'Covid Task Force' : 'Blog'}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-500">
                    {new Date(post.publishedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? 'success' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {page > 1 && (
            <Link href={`/admin/posts?page=${page - 1}`}>
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/posts?page=${page + 1}`}>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
