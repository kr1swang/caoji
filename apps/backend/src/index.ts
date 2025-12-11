export function doPost(event: GoogleAppsScript.Events.DoPost) {
  const payload: object = JSON.parse(event.postData?.contents || '{}')
  const result = { method: 'doPost', ...payload }

  return ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON).setContent(JSON.stringify(result))
}
