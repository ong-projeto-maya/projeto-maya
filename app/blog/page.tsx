import Link from 'next/link'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

const posts = [
  {
    id: '1',
    title: 'O Dia em que Resgatamos a Mel e Seus Filhotes',
    excerpt: 'Uma história emocionante de resiliência e amor maternal. Mel nos ensinou o verdadeiro significado de nunca desistir.',
    date: '2026-02-15',
    author: 'Equipe Maya',
    category: 'Resgates',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
  },
  {
    id: '2',
    title: '5 Dicas Para Preparar Sua Casa Para um Novo Pet',
    excerpt: 'Adotar é uma alegria, mas requer preparação! Veja nossas dicas essenciais para receber seu novo amigo.',
    date: '2026-02-10',
    author: 'Dra. Ana Silva',
    category: 'Dicas',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
  },
  {
    id: '3',
    title: 'Thor Encontrou um Lar: Uma História de Superação',
    excerpt: 'Do abandono ao amor incondicional. Acompanhe a jornada de Thor e sua nova família.',
    date: '2026-02-05',
    author: 'Equipe Maya',
    category: 'Histórias de Sucesso',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-maya-olive mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Blog Projeto Maya
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Histórias, dicas e novidades sobre nossos resgates e adoções
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button className="px-6 py-2 bg-maya-olive text-white rounded-full font-semibold">
            Todos
          </button>
          <button className="px-6 py-2 bg-white dark:bg-gray-800 text-maya-brown dark:text-white rounded-full font-semibold hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors">
            Resgates
          </button>
          <button className="px-6 py-2 bg-white dark:bg-gray-800 text-maya-brown dark:text-white rounded-full font-semibold hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors">
            Dicas
          </button>
          <button className="px-6 py-2 bg-white dark:bg-gray-800 text-maya-brown dark:text-white rounded-full font-semibold hover:bg-maya-olive/20 dark:hover:bg-maya-olive/30 transition-colors">
            Histórias de Sucesso
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl group hover:scale-105 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-maya-olive text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex items-center gap-4 text-sm text-maya-brown/60 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
              </div>

              <h2 className="font-display font-bold text-2xl text-maya-brown dark:text-white mb-3 line-clamp-2 group-hover:text-maya-olive transition-colors">
                {post.title}
              </h2>

              <p className="text-maya-brown/70 dark:text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center text-maya-olive font-semibold group-hover:gap-2 transition-all">
                Ler mais
                <ArrowRight size={18} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-3xl p-12 max-w-2xl mx-auto shadow-lg">
          <h2 className="font-display font-bold text-3xl text-maya-brown dark:text-white mb-4">
            Mais Histórias em Breve!
          </h2>
          <p className="text-maya-brown/70 dark:text-gray-300 mb-6">
            Estamos preparando muitas histórias emocionantes, dicas e novidades. 
            Acompanhe nossas redes sociais para não perder nada!
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Seguir no Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
