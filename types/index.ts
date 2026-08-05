export interface Fermentation {
  id: string
  userId: string
  type: "POC" | "ECO_ENZYM"
  name: string
  batchCode: string | null
  shareCode: string | null
  startDate: string
  endDate: string
  totalDays: number
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABORTED"
  notes: string | null
  createdAt: string
  updatedAt: string
  tasks: Task[]
}

export interface Task {
  id: string
  fermentationId: string
  title: string
  description: string | null
  scheduledDate: string
  completed: boolean
  isCritical: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string | null
}

export type FermentationStatus = Fermentation["status"]
export type FermentationType = Fermentation["type"]
