export type PageItem = number | 'ellipsis'

/**
 * The page buttons to show: the first and last page, the current page and its neighbours, and an
 * ellipsis for each gap. A gap of a single page shows that page instead, since "…" would be as wide.
 *
 * getPageItems(1, 12) → [1, 2, 3, 'ellipsis', 12]
 * getPageItems(6, 12) → [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]
 */
export function getPageItems(current: number, totalPages: number): PageItem[] {
  const pages = new Set([1, current - 1, current, current + 1, totalPages])
  if (current <= 2) pages.add(2).add(3)
  if (current >= totalPages - 1) pages.add(totalPages - 1).add(totalPages - 2)

  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b)
  const items: PageItem[] = []
  for (const page of sorted) {
    const previous = items.at(-1)
    if (typeof previous === 'number' && page - previous === 2) items.push(previous + 1)
    else if (typeof previous === 'number' && page - previous > 2) items.push('ellipsis')
    items.push(page)
  }
  return items
}
