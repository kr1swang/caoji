import type { SheetType } from '@shared/types'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'

export interface ItemWithImages {
  id: string
  images: string[]
}

function getPublicDir(type: SheetType) {
  return path.join(process.cwd(), 'public', 'images', type)
}

// 確保目錄存在
function ensureDir(type: SheetType) {
  const publicDir = getPublicDir(type)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
}

// 下載單張圖片
async function downloadImage(url: string, filepath: string): Promise<void> {
  // 如果文件已存在且大小 > 0，跳過下載
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath)
    if (stats.size > 0) {
      console.log(`  ⏭️  圖片已存在: ${path.basename(filepath)}`)
      return
    }
    // 如果是 0 字節，刪除並重新下載
    fs.unlinkSync(filepath)
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const makeRequest = (requestUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'))
        return
      }

      protocol
        .get(requestUrl, (response) => {
          // 處理重定向
          if (
            response.statusCode === 301 ||
            response.statusCode === 302 ||
            response.statusCode === 303 ||
            response.statusCode === 307 ||
            response.statusCode === 308
          ) {
            const redirectUrl = response.headers.location
            if (!redirectUrl) {
              reject(new Error('Redirect without location'))
              return
            }
            // 對於跨協議重定向，需要使用正確的協議
            const redirectProtocol = redirectUrl.startsWith('https') ? https : http
            if (redirectProtocol !== protocol) {
              downloadImage(redirectUrl, filepath).then(resolve).catch(reject)
              return
            }
            makeRequest(redirectUrl, redirectCount + 1)
            return
          }

          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download ${requestUrl}: ${response.statusCode}`))
            return
          }

          const file = fs.createWriteStream(filepath)

          response.pipe(file)

          file.on('finish', () => {
            file.close(() => {
              // 驗證文件大小
              const stats = fs.statSync(filepath)
              if (stats.size === 0) {
                fs.unlinkSync(filepath)
                reject(new Error(`Downloaded file is empty: ${path.basename(filepath)}`))
              } else {
                console.log(`  ✅ 下載成功: ${path.basename(filepath)} (${(stats.size / 1024).toFixed(2)} KB)`)
                resolve()
              }
            })
          })

          file.on('error', (err) => {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath)
            }
            reject(err)
          })
        })
        .on('error', (err) => {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
          }
          reject(err)
        })
    }

    makeRequest(url)
  })
}

// 下載所有項目的圖片
export async function downloadImages(type: SheetType, items: ItemWithImages[]): Promise<void> {
  ensureDir(type)
  const publicDir = getPublicDir(type)

  console.log(`📥 開始下載 ${items.length} 個 ${type} 的圖片...`)

  for (const item of items) {
    if (!item.images || item.images.length === 0) {
      continue
    }

    console.log(`📸 處理 ${type} ${item.id}`)

    for (let i = 0; i < item.images.length; i++) {
      const imageUrl = item.images[i]
      try {
        const ext = path.extname(new URL(imageUrl).pathname) || '.jpg'
        const filename = `${item.id}-${i}${ext}`
        const filepath = path.join(publicDir, filename)

        await downloadImage(imageUrl, filepath)
      } catch (error) {
        console.error(`  ❌ 下載失敗: ${imageUrl}`, error)
      }
    }
  }

  console.log('🎉 圖片下載完成！')
}

export function getLocalImagePaths(type: SheetType, itemId: string, imageUrls: string[]): string[] {
  return imageUrls.map((url, i) => {
    const ext = path.extname(new URL(url).pathname) || '.jpg'
    return `/images/${type}/${itemId}-${i}${ext}`
  })
}
