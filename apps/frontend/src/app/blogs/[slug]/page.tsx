import axiosInstance from '@/lib/axios'
import type { Blog } from '@shared/types'

async function getBlogs(): Promise<Blog[]> {
  const { data } = await axiosInstance.get('?type=blogs')
  return data
}

export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map(({ id: slug }) => ({ slug }))
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blogs = await getBlogs()
  const blog = blogs.find(({ id }) => id === slug)

  return !blog ? (
    <div>Blog not found</div>
  ) : (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Blog Details</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(blog, null, 2)}</pre>
    </div>
  )
}
