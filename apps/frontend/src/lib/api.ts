const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

async function fetchInstance<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return response.json()
}

export default fetchInstance
