"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarTask {
  id: string
  title: string
  scheduledDate: Date
  completed: boolean
  isCritical: boolean
  fermentation: { name: string; type: string }
}

export function CalendarView({
  tasks: rawTasks,
}: {
  tasks: Array<{
    id: string
    title: string
    scheduledDate: string
    completed: boolean
    isCritical: boolean
    fermentation: { name: string; type: string }
  }>
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const tasks: CalendarTask[] = rawTasks.map((t) => ({
    ...t,
    scheduledDate: parseISO(t.scheduledDate),
  }))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { locale: id })
  const calendarEnd = endOfWeek(monthEnd, { locale: id })

  const days: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  const tasksForSelected = selectedDate
    ? tasks.filter((t) => isSameDay(t.scheduledDate, selectedDate))
    : []

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold text-foreground">Kalender</h1>
        <p className="font-body text-sm text-muted-foreground">Jadwal tugas fermentasi</p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((d) => addMonths(d, -1))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="font-headline font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </span>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth((d) => addMonths(d, 1))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((d) => (
              <div key={d} className="text-center font-headline text-xs uppercase text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const dayTasks = tasks.filter((t) => isSameDay(t.scheduledDate, d))
              const hasCritical = dayTasks.some((t) => t.isCritical && !t.completed)
              const isSelected = selectedDate && isSameDay(d, selectedDate)
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={cn(
                    "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-body transition-colors",
                    !isSameMonth(d, monthStart) && "text-muted-foreground/50",
                    isSameMonth(d, monthStart) && "text-foreground",
                    isSelected && "bg-forest dark:bg-secondary text-white dark:text-secondary-foreground",
                    !isSelected && isSameDay(d, new Date()) && "bg-lime/30 dark:bg-secondary/20 text-foreground font-semibold"
                  )}
                >
                  <span>{format(d, "d")}</span>
                  {dayTasks.length > 0 && (
                      <span className={cn("absolute bottom-1 h-1.5 w-1.5 rounded-full", hasCritical ? "bg-destructive" : "bg-forest dark:bg-secondary")} />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="font-headline text-lg font-semibold text-foreground">
            {format(selectedDate, "d MMMM yyyy", { locale: id })}
          </h2>
          {tasksForSelected.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">Tidak ada tugas.</p>
          ) : (
            tasksForSelected.map((task) => (
              <Card key={task.id} className={cn("overflow-hidden", task.completed && "opacity-70")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={cn("font-body text-sm font-medium", task.completed && "line-through")}>
                        {task.title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {task.fermentation.name} · {task.fermentation.type === "POC" ? "POC" : "Eco Enzym"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.isCritical && !task.completed && (
                        <Badge variant="destructive" className="h-5 text-[10px]">
                          <AlertCircle className="h-3 w-3 mr-1" /> Penting
                        </Badge>
                      )}
                      {task.completed && <Badge variant="secondary" className="h-5 text-[10px]">Selesai</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
