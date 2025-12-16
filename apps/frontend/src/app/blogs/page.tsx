import { BlogCard } from '@/components/BlogCard'
import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import fetch from '@/lib/api'
import type { Blog } from '@caoji/shared'

async function getBlogs(): Promise<Blog[]> {
  const data = await fetch<Blog[]>('?type=blogs')
  return data
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <main className="min-h-screen">
      <BreadcrumbNav className="mb-6" items={[{ label: 'Home', href: '/' }, { label: 'Blogs' }]} />
      <h1 className="mb-8 text-3xl font-bold">Blogs</h1>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No blogs found</EmptyTitle>
            <EmptyDescription>There are no blog posts to display at this time.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  )
}
