import type { SheetType } from '@caoji/shared'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import sharp from 'sharp'
import { formatFileSize } from './utils'

const getPublicDir = (type: SheetType) => path.join(process.cwd(), 'public', 'images', type)

async function compressImage(buffer: Buffer, ext: string): Promise<Buffer> {
  switch (ext.toLowerCase()) {
    case '.png':
      return await sharp(buffer).png({ quality: 80, compressionLevel: 9 }).toBuffer()
    case '.jpg':
    case '.jpeg':
    case '.jfif':
      return await sharp(buffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
    case '.webp':
      return await sharp(buffer).webp({ quality: 80 }).toBuffer()
    case '.gif':
      return await sharp(buffer, { animated: true }).gif({ effort: 10 }).toBuffer()
    default:
      return buffer
  }
}

type FileMeta = Record<'lastModified' | 'contentLength' | 'contentType', string | null>

function getLocalMeta(metaPath: string): FileMeta | null {
  try {
    if (!fs.existsSync(metaPath)) throw new Error('Local Meta file does not exist')
    const localMeta: FileMeta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    return localMeta
  } catch {
    return null
  }
}

async function getRemoteMeta(url: string): Promise<FileMeta> {
  const headResponse = await fetch(url, { method: 'HEAD' })
  if (!headResponse.ok) throw new Error('Remote Meta fetch failed')
  const remoteMeta: FileMeta = {
    lastModified: headResponse.headers.get('last-modified'),
    contentLength: headResponse.headers.get('content-length'),
    contentType: headResponse.headers.get('content-type')
  }
  return remoteMeta
}

function isFileUpToDate(localMeta: FileMeta | null, remoteMeta: FileMeta): boolean {
  try {
    if (!localMeta) throw new Error('Local Meta not found')
    const keys: (keyof FileMeta)[] = ['lastModified', 'contentLength', 'contentType']
    if (!keys.every((key) => remoteMeta[key] && localMeta[key] === remoteMeta[key]))
      throw new Error('File meta mismatch')
    return true
  } catch (e) {
    return false
  }
}

async function downloadFile(url: string, basePath: string): Promise<void> {
  try {
    const metaPath = `${basePath}.meta`
    const localMeta = getLocalMeta(metaPath)
    const remoteMeta = await getRemoteMeta(url)

    const filePath = `${basePath}.${mime.getExtension(remoteMeta.contentType || 'image/jpeg')}`
    const isFileExists = fs.existsSync(filePath)

    if (isFileExists && isFileUpToDate(localMeta, remoteMeta)) {
      console.log(`\n ○ ${path.basename(basePath)} - Up to date`)
      return
    }

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Status ${response.status}`)
    const fileMeta: FileMeta = {
      lastModified: response.headers.get('last-modified'),
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type')
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const compressed = await compressImage(buffer, path.extname(filePath))

    fs.writeFileSync(filePath, compressed)
    fs.writeFileSync(metaPath, JSON.stringify(fileMeta))

    console.log(
      `\n ✓ ${path.basename(basePath)} (${formatFileSize(buffer.length)} → ${formatFileSize(compressed.length)})`
    )
  } catch (e) {
    if (e instanceof Error) console.warn(`\n ✗ ${path.basename(basePath)}: ${e.message}`)
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
        const filename = `${item.id}_${index}`
        await downloadFile(url, path.join(dir, filename))
      })
    })
  )
}

export function getLocalImagePaths(type: SheetType, itemId: string, imageUrls: string[]): string[] {
  return imageUrls.map((_, index) => {
    const dir = getPublicDir(type)
    const filename = `${itemId}_${index}`
    const localMeta = getLocalMeta(path.join(dir, `${filename}.meta`))
    const ext = mime.getExtension(localMeta?.contentType || 'image/jpeg')
    return `/images/${type}/${filename}.${ext}`
  })
}
