import { BlogCard } from '@/components/BlogCard'
import { CourseCard } from '@/components/CourseCard'
import { PortfolioCard } from '@/components/PortfolioCard'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import fetch from '@/lib/api'
import { SheetType, type Blog, type Course, type Portfolio } from '@caoji/shared'
import Link from 'next/link'

async function getData() {
  const results = await Promise.all([
    fetch<Blog[]>('?type=blogs'),
    fetch<Course[]>('?type=courses'),
    fetch<Portfolio[]>('?type=portfolio')
  ])
  const [blogs, courses, portfolio] = results.map((result) => result.slice(0, 3))
  return { blogs, courses, portfolio }
}

export default async function HomePage() {
  const { blogs, courses, portfolio } = await getData()
  const types = [
    { type: SheetType.Blogs, data: blogs },
    { type: SheetType.Courses, data: courses },
    { type: SheetType.Portfolio, data: portfolio }
  ]

  return (
    <main className="min-h-screen space-y-12">
      {types.map(({ type, data }, index) => (
        <RecentSection key={index} type={type} list={data} />
      ))}
    </main>
  )
}

type TypeItem = {
  id: string
  images: string[]
  title: string
  datetime: Date
  content: string
}

interface RecentSectionProps<T extends TypeItem> {
  type: SheetType
  list: T[]
}

function RecentSection<T extends TypeItem>({ type, list }: RecentSectionProps<T>) {
  const CardComponent = {
    [SheetType.Blogs]: BlogCard,
    [SheetType.Courses]: CourseCard,
    [SheetType.Portfolio]: PortfolioCard
  }[type]

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold capitalize">{`Latest ${type}`}</h2>
        <Link href={`/${type}`} className="text-primary hover:underline">
          View All
        </Link>
      </div>
      {list.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <CardComponent key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No items found</EmptyTitle>
            <EmptyDescription>There are no {type} to display at this time.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
