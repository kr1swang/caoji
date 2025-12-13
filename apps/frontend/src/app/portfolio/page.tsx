import fetch from '@/lib/api'
import type { Portfolio } from '@caoji/shared'
import { format } from 'date-fns'
import Link from 'next/link'

async function getPortfolio(): Promise<Portfolio[]> {
  const data = await fetch<Portfolio[]>('?type=portfolio')
  return data
}

export default async function PortfoliosPage() {
  const portfolio = await getPortfolio()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>
      <div className="grid gap-4">
        {portfolio.map((item) => (
          <Link
            key={item.id}
            href={`/portfolio/${item.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{format(item.datetime, 'yyyy-MM-dd')}</p>
            <p className="text-gray-700 line-clamp-2">{item.content}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
