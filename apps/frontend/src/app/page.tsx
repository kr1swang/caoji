import fetch from '@/lib/api'
import { getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Blog, type Course, type Portfolio } from '@caoji/shared'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

async function getData() {
  const results = await Promise.all([
    fetch<Blog[]>('?type=blogs'),
    fetch<Course[]>('?type=courses'),
    fetch<Portfolio[]>('?type=portfolio')
  ])
  const [blogs, courses, portfolio] = results.map((result) => result.slice(0, 2))
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
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold capitalize">{`Latest ${type}`}</h2>
        <Link href={`/${type}`} className="text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      {list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((item) => {
            const [thumbnail] = getLocalImagePaths(type, item.id, item.images)
            return (
              <Link
                key={item.id}
                href={`/${type}/${item.id}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {thumbnail && (
                  <div className="relative w-full h-48 bg-gray-200">
                    <Image
                      src={thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {format(item.datetime, 'yyyy-MM-dd')}
                  </p>
                  <p className="text-gray-700 line-clamp-3">{item.content}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">No item found.</div>
      )}
    </section>
  )
}
