export const sheetTypes = ['courses', 'portfolio', 'blogs'] as const
export type SheetType = (typeof sheetTypes)[number]

export type Course = {
  id: string
  datetime: Date
  title: string
  content: string
  images: string[]
}

export type Portfolio = {
  id: string
  datetime: Date
  title: string
  content: string
  images: string[]
}

export type Blog = {
  id: string
  datetime: Date
  title: string
  content: string
  images: string[]
}
