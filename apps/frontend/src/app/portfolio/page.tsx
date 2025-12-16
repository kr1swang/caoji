import { BreadcrumbNav } from '@/components/BreadcrumbNav'
import { PortfolioCard } from '@/components/PortfolioCard'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import fetch from '@/lib/api'
import type { Portfolio } from '@caoji/shared'

async function getPortfolio(): Promise<Portfolio[]> {
  const data = await fetch<Portfolio[]>('?type=portfolio')
  return data
}

export default async function PortfoliosPage() {
  const portfolio = await getPortfolio()

  return (
    <main className="min-h-screen flex flex-col gap-y-4">
      <BreadcrumbNav items={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]} />
      <h1 className="text-4xl font-bold capitalize">{'Portfolio'}</h1>
      {portfolio.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <PortfolioCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{'No portfolio items found'}</EmptyTitle>
            <EmptyDescription>
              {'There are no portfolio items to display at this time.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </main>
  )
}
