import { SheetType, type Blog, type Course, type Portfolio } from '@caoji/shared'

const SPREADSHEET_ID = '12K9GunsmrIliM4js0AsXfUuYv44oF5TvgpFfbKK6qKs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doGet(event: GoogleAppsScript.Events.DoGet) {
  const { type } = event.parameter
  const isVerified = isValidSheetType(type)
  if (!isVerified) throw new Error('Invalid sheet type')

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(type)
  if (!sheet) throw new Error('Sheet not found')

  const [, ...rows] = sheet.getDataRange().getValues()
  const result = processRows(rows)

  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify(result))
}

function isValidSheetType(value: string): value is SheetType {
  return Object.values(SheetType).includes(value as SheetType)
}

function processRows(rows: string[][]): Course[] | Portfolio[] | Blog[] {
  return rows
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      datetime: new Date(row[1]),
      title: row[2],
      content: row[3],
      images: row[5]
        .split('\n')
        .filter(Boolean)
        .map((id: string) => `https://drive.google.com/uc?id=${id.trim()}`)
    }))
}
