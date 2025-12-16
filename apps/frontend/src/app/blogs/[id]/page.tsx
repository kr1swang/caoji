import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { ImageCarousel } from '@/components/ImageCarousel'
import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Blog } from '@caoji/shared'
import { format } from 'date-fns'

export const dynamic = 'force-static'
export const dynamicParams = false

async function getBlogs(): Promise<Blog[]> {
  const data = await fetch<Blog[]>('?type=blogs')
  return data
}

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs()
    if (blogs.length === 0) throw new Error('No blogs found')
    await downloadImages(SheetType.Blogs, blogs)
    return blogs.map(({ id }) => ({ id }))
  } catch (e) {
    if (e instanceof Error)
      console.warn(`\n - generateStaticParams for [blogs] failed: ${e.message}`)
    return [{ id: 'unknown' }]
  }
}

export default async function BlogPage({ params }: { params: Promise<Record<'id', string>> }) {
  const { id } = await params
  const blogs = await getBlogs()
  const blog = blogs.find((entry) => entry.id === id)

  return !blog ? <main>Blog not found</main> : <BlogDetail blog={blog} />
}

function BlogDetail({ blog }: { blog: Blog }) {
  const localImages = getLocalImagePaths(SheetType.Blogs, blog.id, blog.images)

  return (
    <main className="min-h-screen flex flex-col gap-y-4">
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: blog.title }
        ]}
      />
      <h1 className="text-4xl font-bold capitalize">{blog.title}</h1>
      <time className="text-sm text-muted-foreground">{format(blog.datetime, 'PPP')}</time>
      <ImageCarousel images={localImages} title={blog.title} />
      <span className="whitespace-pre-wrap leading-relaxed">{blog.content}</span>
    </main>
  )
}
