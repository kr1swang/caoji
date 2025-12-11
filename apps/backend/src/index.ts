// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doPost(event: GoogleAppsScript.Events.DoPost) {
  const result = { method: 'doPost', ...event.parameter }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
}
