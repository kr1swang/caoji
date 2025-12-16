import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { CourseCard } from '@/components/CourseCard'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import fetch from '@/lib/api'
import type { Course } from '@caoji/shared'

async function getCourses(): Promise<Course[]> {
  const data = await fetch<Course[]>('?type=courses')
  return data
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="min-h-screen">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: 'Home', href: '/' }, { label: 'Courses' }]}
      />
      <h1 className="mb-8 text-3xl font-bold">Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No courses found</EmptyTitle>
            <EmptyDescription>There are no courses to display at this time.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  )
}
