import { clsx, type ClassValue } from "clsx"
import { randomInt } from "crypto"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCode(len: number) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: len }, () => chars[randomInt(36)]).join('')
}
