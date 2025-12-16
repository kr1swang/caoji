import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { ImageCarousel } from '@/components/ImageCarousel'
import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Portfolio } from '@caoji/shared'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

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
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: item.title }
        ]}
      />

      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{item.title}</h1>
          <time className="text-muted-foreground">
            {format(item.datetime, 'PPP', { locale: zhTW })}
          </time>
        </header>

        <ImageCarousel images={localImages} title={item.title} />

        <div className="prose prose-lg max-w-none">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <p className="whitespace-pre-wrap text-card-foreground">{item.content}</p>
          </div>
        </div>
      </article>
    </main>
  )
}
