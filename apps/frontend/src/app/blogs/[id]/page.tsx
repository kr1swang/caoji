import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Blog } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

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
    <main className="min-h-screen">
      <Link href="/blogs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <time className="text-gray-600">{format(blog.datetime, 'PPP', { locale: zhTW })}</time>
        </header>

        {localImages.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {localImages.map((imagePath, index) => (
              <div
                key={index}
                className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden"
              >
                <Image
                  src={imagePath}
                  alt={`${blog.title} - 圖片 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-800 whitespace-pre-wrap">{blog.content}</p>
          </div>
        </div>
      </article>
    </main>
  )
}
