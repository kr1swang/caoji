import fetch from '@/lib/api'
import type { Portfolio } from '@shared/types'

async function getPortfolio(): Promise<Portfolio[]> {
  const data = await fetch<Portfolio[]>('?type=portfolio')
  return data
}

export async function generateStaticParams() {
  const portfolio = await getPortfolio()
  return portfolio.map(({ id: slug }) => ({ slug }))
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const portfolio = await getPortfolio()
  const item = portfolio.find(({ id }) => id === slug)

  return !item ? (
    <div>Portfolio not found</div>
  ) : (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Portfolio Details</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(item, null, 2)}</pre>
    </div>
  )
}
