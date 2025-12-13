import fetch from '@/lib/api'
import type { Blog } from '@caoji/shared/types'
import Link from 'next/link'

async function getBlogs(): Promise<Blog[]> {
  const data = await fetch<Blog[]>('?type=blogs')
  return data
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{new Date(blog.datetime).toLocaleDateString()}</p>
            <p className="text-gray-700 line-clamp-2">{blog.content}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
