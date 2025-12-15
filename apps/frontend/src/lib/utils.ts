import { clsx, type ClassValue } from 'clsx'
import { filesize } from 'filesize'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  return filesize(bytes, { base: 2, standard: 'jedec' }) as string
}
