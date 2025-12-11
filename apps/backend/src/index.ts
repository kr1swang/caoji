const sheetTypes = ['courses', 'portfolio', 'blogs'] as const
type SheetType = (typeof sheetTypes)[number]

type Course = {
  id: string
  datetime: Date
  title: string
  content: string
  images: string[]
}

export function doPost(event: GoogleAppsScript.Events.DoPost) {
  const payload = JSON.parse(event.postData?.contents || '{}')
  const isVerified = sheetTypes.includes(payload.type)
  if (!isVerified) throw new Error('Invalid sheet type')

  const spreadsheetId = '12K9GunsmrIliM4js0AsXfUuYv44oF5TvgpFfbKK6qKs'
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const sheet = spreadsheet.getSheetByName(payload.type as SheetType)
  if (!sheet) throw new Error('Sheet not found')

  switch (payload.type) {
    case 'courses': {
      const list = sheet.getDataRange().getValues()
      Logger.log(list)
      break
    }
    case 'portfolio':
    case 'blogs': {
      break
    }
  }

  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setContent(JSON.stringify({ status: 'success' }))
}
