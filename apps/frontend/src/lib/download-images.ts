import type { SheetType } from '@caoji/shared'
import fs from 'fs'
import path from 'path'

const getPublicDir = (type: SheetType) => path.join(process.cwd(), 'public', 'images', type)

const getImageFilename = (id: string, index: number, url: string) => {
  const ext = path.extname(new URL(url).pathname) || '.jpg'
  return `${id}-${index}${ext}`
}

async function downloadFile(url: string, filepath: string): Promise<void> {
  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) return

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Status ${response.status}`)

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(filepath, buffer)
}

interface ItemWithImages {
  id: string
  images: string[]
}

export async function downloadImages(type: SheetType, items: ItemWithImages[]): Promise<void> {
  const dir = getPublicDir(type)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  console.log(` - Processing ${items.length} items for ${type}...`)

  for (const item of items) {
    if (!item.images?.length) continue

    for (const [index, url] of item.images.entries()) {
      try {
        const filename = getImageFilename(item.id, index, url)
        await downloadFile(url, path.join(dir, filename))
      } catch (e) {
        if (e instanceof Error) console.warn(` - Download images failed ${url}:`, e.message)
      }
    }
  }
}

export function getLocalImagePaths(type: SheetType, itemId: string, imageUrls: string[]): string[] {
  return imageUrls.map((url, i) => `/images/${type}/${getImageFilename(itemId, i, url)}`)
}
