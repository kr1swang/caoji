import fetch from '@/lib/api'
import { getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Course } from '@caoji/shared'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const [thumbnail] = getLocalImagePaths(SheetType.Courses, course.id, course.images)
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {thumbnail && (
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {format(course.datetime, 'yyyy-MM-dd')}
                  </p>
                  <p className="text-gray-700 line-clamp-3">{course.content}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">No item found.</div>
      )}
    </main>
  )
}
