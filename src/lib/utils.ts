import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Pas encore':
      return 'status-pas-encore'
    case 'En cours':
      return 'status-en-cours'
    case 'Terminé':
      return 'status-termine'
    case 'Hors cible':
      return 'status-hors-cible'
    case 'À ne pas générer':
      return 'status-ne-pas-generer'
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200'
  }
}

export function calculateCompletionPercentage(
  total: number,
  completed: number,
  outOfScope: number,
  notToGenerate: number
): number {
  const validTotal = total - outOfScope - notToGenerate
  if (validTotal === 0) return 0
  return Math.round((completed / validTotal) * 100)
}