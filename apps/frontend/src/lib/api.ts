const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

async function fetchInstance<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)

  const data = await response.json()

  if (data && typeof data === 'object') {
    if ('error' in data) throw new Error(`API error: ${data.error}`)
    if ('message' in data && 'success' in data && data.success === false) throw new Error(`API error: ${data.message}`)
  }

  return data
}

export default fetchInstance
