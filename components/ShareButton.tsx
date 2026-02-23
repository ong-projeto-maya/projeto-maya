'use client'

import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function ShareButton({ url, title, description, className = '' }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        })
      } catch (err) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      setShowMenu(!showMenu)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`btn-outline inline-flex items-center justify-center gap-2 ${className}`}
      >
        <Share2 size={20} />
        Compartilhar
      </button>

      {showMenu && !navigator.share && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl p-4 z-10 min-w-[200px]">
          <div className="space-y-2">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 hover:bg-maya-beige rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Facebook size={20} className="text-blue-600" />
              <span className="text-maya-brown">Facebook</span>
            </a>
            
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 hover:bg-maya-beige rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Twitter size={20} className="text-sky-500" />
              <span className="text-maya-brown">Twitter</span>
            </a>

            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 hover:bg-maya-beige rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <MessageCircle size={20} className="text-green-600" />
              <span className="text-maya-brown">WhatsApp</span>
            </a>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 p-2 hover:bg-maya-beige rounded-lg transition-colors w-full"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={20} className="text-maya-brown" />
                  <span className="text-maya-brown">Copiar link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}
