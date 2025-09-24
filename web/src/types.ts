// Represents a Contact returned by the Laravel API.
export type Contact = {
  id: number
  first_name: string
  last_name: string
  email: string
  company?: string | null
  created_at: string
  updated_at: string
}

// Laravel's pagination envelope shape.
export type Paginated<T> = {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: { url: string | null; label: string; page: number | null; active: boolean }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}
