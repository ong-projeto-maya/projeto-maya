// Animal interface — the canonical type used throughout the app.
// All runtime data is fetched from Supabase via hooks/useAnimals.ts.
export interface Animal {
  id: string
  name: string
  type: 'dog' | 'cat'
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  temperament: string[]
  story: string
  image: string
  images: string[]
  isAdopted: boolean
  isPuppy: boolean
  isRescued: boolean
  isMixed: boolean
}

// Kept for backward-compat imports that have not yet been migrated.
// Do NOT use this directly — use the useAnimals() hook instead.
export const animals: Animal[] = []

// Stats are now in the site_stats Supabase table.
// Use the useSiteStats hook or query directly in server components.
export const stats = {
  rescued: 0,
  adopted: 0,
  volunteers: 0,
  monthlyGoal: 0,
  currentDonations: 0,
}
