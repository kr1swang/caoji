import fetch from '@/lib/api'
import type { Course } from '@shared/types'
import Link from 'next/link'

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Courses</h1>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{new Date(course.datetime).toLocaleDateString()}</p>
            <p className="text-gray-700 line-clamp-2">{course.content}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
