import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Course } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'
export const dynamicParams = false

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export async function generateStaticParams() {
  try {
    const courses = await getCourses()
    if (courses.length === 0)
      throw new Error('No courses found, nextjs requires at least one param')
    await downloadImages(SheetType.Courses, courses)
    return courses.map(({ id }) => ({ id }))
  } catch (e) {
    console.warn('generateStaticParams for courses failed:', e)
    return [{ id: 'unknown' }]
  }
}

export default async function CoursePage({ params }: { params: Promise<Record<'id', string>> }) {
  const { id } = await params
  const courses = await getCourses()
  const course = courses.find((entry) => entry.id === id)

  return !course ? <div>Course not found</div> : <CourseDetail course={course} />
}

function CourseDetail({ course }: { course: Course }) {
  const localImages = getLocalImagePaths(SheetType.Courses, course.id, course.images)

  return (
    <div className="min-h-screen p-8">
      <Link href="/courses" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <time className="text-gray-600">{format(course.datetime, 'PPP', { locale: zhTW })}</time>
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
                  alt={`${course.title} - 圖片 ${index + 1}`}
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
            <p className="text-gray-800 whitespace-pre-wrap">{course.content}</p>
          </div>
        </div>
      </article>
    </div>
  )
}
