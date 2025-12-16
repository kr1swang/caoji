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
import { SheetType, type Course } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'

export const dynamic = 'force-static'
export const dynamicParams = false

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export async function generateStaticParams() {
  try {
    const courses = await getCourses()
    if (courses.length === 0) throw new Error('No courses found')
    await downloadImages(SheetType.Courses, courses)
    return courses.map(({ id }) => ({ id }))
  } catch (e) {
    if (e instanceof Error)
      console.warn(`\n - generateStaticParams for [courses] failed: ${e.message}`)
    return [{ id: 'unknown' }]
  }
}

export default async function CoursePage({ params }: { params: Promise<Record<'id', string>> }) {
  const { id } = await params
  const courses = await getCourses()
  const course = courses.find((entry) => entry.id === id)

  return !course ? <main>Course not found</main> : <CourseDetail course={course} />
}

function CourseDetail({ course }: { course: Course }) {
  const localImages = getLocalImagePaths(SheetType.Courses, course.id, course.images)

  return (
    <main className="min-h-screen">
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: course.title }
        ]}
      />

      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
          <time className="text-muted-foreground">
            {format(course.datetime, 'PPP', { locale: zhTW })}
          </time>
        </header>

        {localImages.length > 0 && (
          <div className="mb-8">
            {localImages.length === 1 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={localImages[0]}
                  alt={course.title}
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
                          alt={`${course.title} - 圖片 ${index + 1}`}
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
            <p className="whitespace-pre-wrap text-card-foreground">{course.content}</p>
          </div>
        </div>
      </article>
    </main>
  )
}
