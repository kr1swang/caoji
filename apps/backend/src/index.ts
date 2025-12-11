import { type Blog, type Course, type Portfolio, type SheetType, sheetTypes } from '@shared/types'

const SPREADSHEET_ID = '12K9GunsmrIliM4js0AsXfUuYv44oF5TvgpFfbKK6qKs'

export function doPost(event: GoogleAppsScript.Events.DoPost) {
  const payload = JSON.parse(event.postData?.contents || '{}')
  const isVerified = sheetTypes.includes(payload.type)
  if (!isVerified) throw new Error('Invalid sheet type')

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(payload.type as SheetType)
  if (!sheet) throw new Error('Sheet not found')

  const [, ...rows] = sheet.getDataRange().getValues()
  switch (payload.type) {
    case 'courses': {
      const result: Course[] = rows
        .filter((row) => row[0])
        .map((row) => ({
          id: row[0],
          datetime: new Date(row[1]),
          title: row[2],
          content: row[3],
          images: row[5]
            .split('\n')
            .filter(Boolean)
            .map((id: string) => `https://drive.google.com/uc?export=view&id=${id.trim()}`)
        }))

      return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify(result))
    }
    case 'portfolio': {
      const result: Portfolio[] = rows
        .filter((row) => row[0])
        .map((row) => ({
          id: row[0],
          datetime: new Date(row[1]),
          title: row[2],
          content: row[3],
          images: row[5]
            .split('\n')
            .filter(Boolean)
            .map((id: string) => `https://drive.google.com/uc?export=view&id=${id.trim()}`)
        }))

      return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify(result))
    }
    case 'blogs': {
      const result: Blog[] = rows
        .filter((row) => row[0])
        .map((row) => ({
          id: row[0],
          datetime: new Date(row[1]),
          title: row[2],
          content: row[3],
          images: row[5]
            .split('\n')
            .filter(Boolean)
            .map((id: string) => `https://drive.google.com/uc?export=view&id=${id.trim()}`)
        }))

      return ContentService.createTextOutput()
        .setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify(result))
    }
  }
}
