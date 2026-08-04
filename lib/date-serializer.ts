/**
 * Serialize Prisma Date objects to ISO strings recursively.
 * Used in Server Components before passing data to Client Components.
 */
type SerializeDates<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? Array<SerializeDates<U>>
    : T extends object
      ? { [K in keyof T]: SerializeDates<T[K]> }
      : T

export function serializeDates<T extends Record<string, unknown>>(obj: T): SerializeDates<T> {
  const result: Record<string, unknown> = { ...obj }
  for (const key in result) {
    const value = result[key]
    if (value instanceof Date) {
      result[key] = value.toISOString()
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item instanceof Date
          ? item.toISOString()
          : typeof item === "object" && item !== null
            ? serializeDates(item as Record<string, unknown>)
            : item
      )
    } else if (typeof value === "object" && value !== null) {
      result[key] = serializeDates(value as Record<string, unknown>)
    }
  }
  return result as SerializeDates<T>
}
