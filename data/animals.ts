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
}

export const animals: Animal[] = [
  {
    id: '1',
    name: 'Mel',
    type: 'dog',
    age: '3 anos',
    gender: 'female',
    size: 'medium',
    temperament: ['Dócil', 'Carinhosa', 'Brincalhona'],
    story: 'Mel foi resgatada das ruas com seus filhotes. Depois de cuidar de todos eles, agora chegou a hora dela encontrar uma família amorosa. É super carinhosa e adora crianças!',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
      'https://images.unsplash.com/photo-1598133893773-de3574464ef0?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: false
  },
  {
    id: '2',
    name: 'Thor',
    type: 'dog',
    age: '5 meses',
    gender: 'male',
    size: 'large',
    temperament: ['Enérgico', 'Leal', 'Protetor'],
    story: 'Thor é um filhote cheio de energia que foi abandonado ainda bebê. Está crescendo forte e saudável, procurando uma família que goste de aventuras!',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: true
  },
  {
    id: '3',
    name: 'Luna',
    type: 'cat',
    age: '2 anos',
    gender: 'female',
    size: 'small',
    temperament: ['Calma', 'Independente', 'Carinhosa'],
    story: 'Luna foi encontrada machucada na rua. Após tratamento veterinário completo, está pronta para conhecer seu lar definitivo. Adora carinho e é muito tranquila.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
      'https://images.unsplash.com/photo-1573865526739-10c1dd7ac636?w=800&q=80',
      'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: false
  },
  {
    id: '4',
    name: 'Bob',
    type: 'dog',
    age: '7 anos',
    gender: 'male',
    size: 'small',
    temperament: ['Calmo', 'Companheiro', 'Dócil'],
    story: 'Bob é um senhor de idade que precisa de uma família paciente e amorosa. Apesar da idade, ainda tem muito amor para dar. Ideal para quem busca um companheiro tranquilo.',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: false
  },
  {
    id: '5',
    name: 'Nina',
    type: 'cat',
    age: '4 meses',
    gender: 'female',
    size: 'small',
    temperament: ['Brincalhona', 'Curiosa', 'Sociável'],
    story: 'Nina é uma gatinha filhote super ativa e curiosa. Foi resgatada de um terreno abandonado. Adora brincar e está pronta para alegrar uma nova família!',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&q=80',
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: true
  },
  {
    id: '6',
    name: 'Max',
    type: 'dog',
    age: '4 anos',
    gender: 'male',
    size: 'large',
    temperament: ['Guardião', 'Leal', 'Inteligente'],
    story: 'Max foi resgatado de maus-tratos. Após muito carinho e tratamento, recuperou a confiança nos humanos. É um cão leal e protetor, perfeito para quem busca um guardião.',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',
      'https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800&q=80',
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: false
  },
  {
    id: '7',
    name: 'Mia',
    type: 'cat',
    age: '1 ano',
    gender: 'female',
    size: 'small',
    temperament: ['Carinhosa', 'Vocal', 'Companheira'],
    story: 'Mia é uma gatinha que adora conversar! Foi resgatada de uma colônia e socializada com muito amor. Perfeita para quem quer um pet comunicativo e afetuoso.',
    image: 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: false
  },
  {
    id: '8',
    name: 'Caramelo',
    type: 'dog',
    age: '6 meses',
    gender: 'male',
    size: 'medium',
    temperament: ['Alegre', 'Sociável', 'Brincalhão'],
    story: 'Caramelo é o típico vira-lata brasileiro: cheio de amor, leal e super inteligente. Foi resgatado com a mãe e irmãos, todos já adotados. Agora é a vez dele!',
    image: 'https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80'
    ],
    isAdopted: false,
    isPuppy: true
  }
]

export const stats = {
  rescued: 347,
  adopted: 289,
  volunteers: 52,
  monthlyGoal: 10000,
  currentDonations: 6500
}
