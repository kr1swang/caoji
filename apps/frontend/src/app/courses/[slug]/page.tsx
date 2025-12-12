import axiosInstance from '@/lib/axios'
import type { Course } from '@shared/types'

async function getCourses(): Promise<Course[]> {
  const { data } = await axiosInstance.get('?type=courses')
  return data
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map(({ id: slug }) => ({ slug }))
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const courses = await getCourses()
  const course = courses.find(({ id }) => id === slug)

  return !course ? (
    <div>Course not found</div>
  ) : (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(course, null, 2)}</pre>
    </div>
  )
}
