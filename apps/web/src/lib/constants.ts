export const SITE_NAME = 'Haier România'
export const SITE_DESCRIPTION = 'Catalog produse Haier climatizare rezidențială'

// Cloudflare R2 public URL for media files
export const R2_PUBLIC_URL = 'https://pub-3013ff0157c24567adca9dab49d95319.r2.dev'

export const CONTACT = {
  phone: '0376 448 475',
  email: 'contact@haier.ro',
  locations: [
    { name: 'Sediu Cluj-Napoca', address: 'Strada Fabricii 105, Etajul 5, Cluj-Napoca' },
    { name: 'Depozit Luna', address: 'Strada Mihai Eminescu 454, Luna de Sus, Comuna Florești' },
    { name: 'Sediu București', address: 'Str. Diamantului nr. 81, Bragadiru' },
    { name: 'Depozit Central', address: 'Str. Italia 1-7, P3 Bucharest A1 Logistic Park, Dep. 3, Chiajna, Ilfov' },
  ],
} as const

export const SOCIAL = {
  facebook: 'https://facebook.com/haierromania',
  instagram: 'https://instagram.com/haierromania',
} as const
