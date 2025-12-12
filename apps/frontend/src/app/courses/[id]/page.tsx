import fetch from '@/lib/api'
import type { Course } from '@shared/types'

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map(({ id }) => ({ id }))
}

export default async function CoursePage({ params }: { params: Promise<Record<'id', string>> }) {
  const { id } = await params
  const courses = await getCourses()
  const course = courses.find((entry) => entry.id === id)

  return !course ? (
    <div>Course not found</div>
  ) : (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(course, null, 2)}</pre>
    </div>
  )
}
