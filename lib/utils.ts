import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApplicantCount(count: number) {
  return `${count} ${count === 1 ? 'applicant' : 'applicants'}`
}
