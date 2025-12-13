const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

const CONTENT_TYPE = 'application/json' as const

async function fetchInstance<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: { Accept: CONTENT_TYPE } })
  const rawData = await response.text()
  const contentType = response.headers.get('content-type') || 'unknown'
  const isValid = contentType.includes(CONTENT_TYPE)

  if (!isValid) {
    const [, message] = rawData.match(/>(Error: [^<]+)<\/div>/) || []
    throw new Error(message || `Unexpected error: unknown (${response.status})`)
  }

  const data = JSON.parse(rawData, (key, value) => {
    if (key === 'datetime' && typeof value === 'string') return new Date(value)
    return value
  })

  if (!response.ok) throw new Error(`Request failed: ${data.message || 'unknown'}`)

  return data
}

export default fetchInstance
