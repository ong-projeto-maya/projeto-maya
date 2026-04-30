import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase-server'
import { ArrowLeft, Heart, MessageCircle, Share2, Dog, Cat, Ruler, Cake } from 'lucide-react'

export const dynamic = 'force-dynamic'

function mapAnimal(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as 'dog' | 'cat',
    age: row.age as string,
    gender: row.gender as 'male' | 'female',
    size: row.size as 'small' | 'medium' | 'large',
    temperament: (row.temperament as string[]) ?? [],
    story: row.story as string,
    image: row.image as string,
    images: (row.images as string[]) ?? [],
    isAdopted: row.is_adopted as boolean,
    isPuppy: row.is_puppy as boolean,
    isRescued: row.is_rescued as boolean,
    isMixed: row.is_mixed as boolean,
  }
}

export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient()
  const { data: row } = await supabase
    .from('animais')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!row) {
    notFound()
  }

  const animal = mapAnimal(row)

  const { data: otherRows } = await supabase
    .from('animais')
    .select('*')
    .neq('id', params.id)
    .eq('is_adopted', false)
    .order('sort_order', { ascending: true })
    .limit(3)

  const otherAnimals = (otherRows ?? []).map(mapAnimal)

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse em conhecer o(a) ${animal.name}. Gostaria de mais informações sobre adoção.`
  )
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5519994128408'}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-maya-beige py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/adocao" 
          className="inline-flex items-center gap-2 text-maya-green hover:text-maya-green mb-8 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para adoções
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative h-96 mb-4 rounded-3xl overflow-hidden bg-gray-200">
              <Image
                src={animal.image}
                alt={animal.name}
                fill
                className="object-cover"
              />
              {animal.isPuppy && (
                <span className="absolute top-4 left-4 bg-maya-blue text-white px-4 py-2 rounded-full font-semibold">
                  Filhote
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {animal.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {animal.images.slice(1).map((img, index) => (
                  <div key={index} className="relative h-24 rounded-xl overflow-hidden bg-gray-200">
                    <Image
                      src={img}
                      alt={`${animal.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-5xl font-display text-maya-brown mb-2">
                  {animal.name}
                </h1>
                <p className="text-xl text-maya-brown/60 flex items-center gap-2">
                  {animal.type === 'dog' ? (
                    <>
                      <Dog size={20} />
                      Cachorro
                    </>
                  ) : (
                    <>
                      <Cat size={20} />
                      Gato
                    </>
                  )} • {animal.age}
                </p>
              </div>
              <button className="p-3 bg-maya-beige-dark rounded-full hover:bg-maya-green/20 transition-colors">
                <Heart className="w-6 h-6 text-maya-green" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  {animal.gender === 'male' ? (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">♂</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-bold text-lg">♀</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-maya-brown/70">
                  {animal.gender === 'male' ? 'Macho' : 'Fêmea'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-maya-green/10 flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-maya-green" />
                  </div>
                </div>
                <div className="text-sm text-maya-brown/70">
                  {animal.size === 'small' ? 'Pequeno' : animal.size === 'medium' ? 'Médio' : 'Grande'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-maya-blue/10 flex items-center justify-center">
                    <Cake className="w-5 h-5 text-maya-blue" />
                  </div>
                </div>
                <div className="text-sm text-maya-brown/70">{animal.age}</div>
              </div>
            </div>

            {/* Temperament */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-maya-brown mb-3">
                Temperamento
              </h2>
              <div className="flex flex-wrap gap-3">
                {animal.temperament.map((trait) => (
                  <span
                    key={trait}
                    className="bg-maya-green/10 text-maya-green px-4 py-2 rounded-full font-semibold"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Story */}
            <div className="mb-8">
              <h2 className="font-display text-2xl text-maya-brown mb-3">
                História
              </h2>
              <p className="text-maya-brown/80 leading-relaxed">
                {animal.story}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Quero Conhecer {animal.name}
              </a>
              <button className="btn-outline w-full inline-flex items-center justify-center gap-2">
                <Share2 size={20} />
                Compartilhar
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-maya-blue/10 border-l-4 border-maya-blue rounded-lg p-4">
              <p className="text-sm text-maya-brown">
                <strong>Importante:</strong> Todos os nossos animais são entregues vacinados, 
                vermifugados e castrados (quando apropriado pela idade). Realizamos acompanhamento 
                pós-adoção para garantir o bem-estar do pet.
              </p>
            </div>
          </div>
        </div>

        {/* Other Animals */}
        <div className="mt-20">
          <h2 className="section-title text-center mb-12">Conheça Outros Amiguinhos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherAnimals.map((otherAnimal) => (
                <Link
                  key={otherAnimal.id}
                  href={`/adocao/${otherAnimal.id}`}
                  className="card group hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-200">
                    <Image
                      src={otherAnimal.image}
                      alt={otherAnimal.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-xl text-maya-brown mb-2">
                    {otherAnimal.name}
                  </h3>
                  <p className="text-maya-brown/60 text-sm flex items-center gap-1">
                    {otherAnimal.type === 'dog' ? <Dog size={16} /> : <Cat size={16} />}
                    {otherAnimal.age}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
