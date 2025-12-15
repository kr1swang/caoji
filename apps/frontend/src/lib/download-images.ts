import type { SheetType } from '@caoji/shared'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { formatFileSize } from './utils'

const getPublicDir = (type: SheetType) => path.join(process.cwd(), 'public', 'images', type)

const getImageFilename = (id: string, index: number, url: string) => {
  const ext = path.extname(new URL(url).pathname) || '.jpg'
  return `${id}_${index}${ext}`
}

async function compressImage(buffer: Buffer, ext: string): Promise<Buffer> {
  switch (ext.toLowerCase()) {
    case '.png':
      return await sharp(buffer).png({ quality: 80, compressionLevel: 9 }).toBuffer()
    case '.jpg':
    case '.jpeg':
      return await sharp(buffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
    case '.webp':
      return await sharp(buffer).webp({ quality: 80 }).toBuffer()
    default:
      return buffer
  }
}

interface FileMeta {
  lastModified: string | null
  contentLength: string | null
  compressedSize: number
}

async function isFileUpToDate(url: string, metaPath: string): Promise<boolean> {
  if (!fs.existsSync(metaPath)) return false

  const localMeta: FileMeta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  const headResponse = await fetch(url, { method: 'HEAD' })
  const { lastModified, contentLength } = {
    lastModified: headResponse.headers.get('last-modified'),
    contentLength: headResponse.headers.get('content-length')
  }

  return !!(
    lastModified &&
    contentLength &&
    localMeta.lastModified === lastModified &&
    localMeta.contentLength === contentLength
  )
}

async function downloadFile(url: string, filePath: string): Promise<void> {
  try {
    const metaPath = `${filePath}.meta`
    const filename = path.basename(filePath)

    if (fs.existsSync(filePath) && (await isFileUpToDate(url, metaPath))) {
      console.log(`\n ○ ${filename} - Up to date`)
      return
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Status ${response.status}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    const compressed = await compressImage(buffer, path.extname(filePath))

    fs.writeFileSync(filePath, compressed)
    fs.writeFileSync(
      metaPath,
      JSON.stringify({
        lastModified: response.headers.get('last-modified'),
        contentLength: response.headers.get('content-length'),
        compressedSize: compressed.length
      })
    )

    console.log(
      `\n ✓ ${filename} (${formatFileSize(buffer.length)} → ${formatFileSize(compressed.length)})`
    )
  } catch (e) {
    if (e instanceof Error) console.warn(`\n ✗ ${path.basename(filePath)}: ${e.message}`)
  }
}

interface ItemWithImages {
  id: string
  images: string[]
}

export async function downloadImages(type: SheetType, items: ItemWithImages[]): Promise<void> {
  const dir = getPublicDir(type)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  console.log(`\n - Processing ${items.length} items for ${type}...`)

  await Promise.allSettled(
    items.flatMap((item) => {
      return item.images.map(async (url, index) => {
        const filename = getImageFilename(item.id, index, url)
        await downloadFile(url, path.join(dir, filename))
      })
    })
  )
}

export function getLocalImagePaths(type: SheetType, itemId: string, imageUrls: string[]): string[] {
  return imageUrls.map((url, i) => `/images/${type}/${getImageFilename(itemId, i, url)}`)
}
