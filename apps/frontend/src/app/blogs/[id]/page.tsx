import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Blog } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'

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
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: blog.title }
        ]}
      />

      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{blog.title}</h1>
          <time className="text-muted-foreground">
            {format(blog.datetime, 'PPP', { locale: zhTW })}
          </time>
        </header>

        {localImages.length > 0 && (
          <div className="mb-8">
            {localImages.length === 1 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={localImages[0]}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {localImages.map((imagePath, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={imagePath}
                          alt={`${blog.title} - 圖片 ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <p className="whitespace-pre-wrap text-card-foreground">{blog.content}</p>
          </div>
        </div>
      </article>
    </main>
  )
}
