import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Portfolio } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'
export const dynamicParams = false

async function getPortfolio(): Promise<Portfolio[]> {
  const data = await fetch<Portfolio[]>('?type=portfolio')
  return data
}

export async function generateStaticParams() {
  try {
    const portfolio = await getPortfolio()
    if (portfolio.length === 0) throw new Error('No portfolio found')
    await downloadImages(SheetType.Portfolio, portfolio)
    return portfolio.map(({ id }) => ({ id }))
  } catch (e) {
    if (e instanceof Error)
      console.warn(`\n - generateStaticParams for [portfolio] failed: ${e.message}`)
    return [{ id: 'unknown' }]
  }
}

export default async function PortfolioPage({ params }: { params: Promise<Record<'id', string>> }) {
  const { id } = await params
  const portfolio = await getPortfolio()
  const item = portfolio.find((entry) => entry.id === id)

  return !item ? <main>Portfolio not found</main> : <PortfolioDetail item={item} />
}

function PortfolioDetail({ item }: { item: Portfolio }) {
  const localImages = getLocalImagePaths(SheetType.Portfolio, item.id, item.images)

  return (
    <main className="min-h-screen">
      <Link href="/portfolio" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
          <time className="text-gray-600">{format(item.datetime, 'PPP', { locale: zhTW })}</time>
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
                  alt={`${item.title} - 圖片 ${index + 1}`}
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
            <p className="text-gray-800 whitespace-pre-wrap">{item.content}</p>
          </div>
        </div>
      </article>
    </main>
  )
}
