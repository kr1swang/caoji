import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { ImageCarousel } from '@/components/ImageCarousel'
import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Course } from '@caoji/shared'
import { format } from 'date-fns'

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

  return course && <CourseDetail course={course} />
}

function CourseDetail({ course }: { course: Course }) {
  const localImages = getLocalImagePaths(SheetType.Courses, course.id, course.images)

  return (
    <main className="min-h-screen flex flex-col gap-y-4">
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: course.title }
        ]}
      />
      <h1 className="text-4xl font-bold capitalize">{course.title}</h1>
      <time className="text-sm text-muted-foreground">{format(course.datetime, 'PPP')}</time>
      <ImageCarousel images={localImages} title={course.title} />
      <span className="whitespace-pre-wrap leading-relaxed">{course.content}</span>
    </main>
  )
}
