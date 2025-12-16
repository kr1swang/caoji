import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { ImageCarousel } from '@/components/ImageCarousel'
import fetch from '@/lib/api'
import { downloadImages, getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Portfolio } from '@caoji/shared'
import { format } from 'date-fns'

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
    <main className="min-h-screen flex flex-col gap-y-4">
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: item.title }
        ]}
      />
      <h1 className="text-4xl font-bold capitalize">{item.title}</h1>
      <time className="text-sm text-muted-foreground">{format(item.datetime, 'PPP')}</time>
      <ImageCarousel images={localImages} title={item.title} />
      <span className="whitespace-pre-wrap leading-relaxed">{item.content}</span>
    </main>
  )
}
