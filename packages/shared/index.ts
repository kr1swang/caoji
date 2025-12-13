export enum SheetType {
  Courses = 'courses',
  Portfolio = 'portfolio',
  Blogs = 'blogs'
}

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
