'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'

const CATEGORIES = ['Tous', 'Conseils CV', 'Entretien', 'Marché', 'Formation', 'Conseils', 'Emploi', 'Actualité']

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = selectedCategory === 'Tous'
    ? posts
    : posts.filter(p => p.cat === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero avec image */}
      <section className="relative bg-gradient-to-br from-[#001a33] via-[#78350f] to-[#d97706] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80"
            alt="Blog Emploi Plus"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/90 via-[#78350f]/70 to-[#d97706]/60" />
        <div className="container mx-auto px-6 relative text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            📰 Blog & Conseils
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">Blog Emploi Plus</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">
            Conseils, astuces et actualités du marché du travail congolais.
          </p>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          {/* Catégories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all border-2 ${
                  selectedCategory === cat
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-lg font-medium">
                {posts.length === 0 ? 'Aucun article publié pour le moment.' : 'Aucun article dans cette catégorie.'}
              </p>
              {posts.length > 0 && (
                <button onClick={() => setSelectedCategory('Tous')} className="mt-3 text-amber-500 underline text-sm">
                  Voir tous les articles
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <article key={post.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="h-40 flex items-center justify-center text-6xl" style={{ background: post.bg }}>
                    {post.emoji}
                  </div>
                  <div className="p-6">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">
                      {post.cat}
                    </span>
                    <h2 className="font-serif text-lg text-[#001a33] mb-2 group-hover:text-amber-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />{post.date}
                      </span>
                      <Link href={`/blog/${post.id}`}
                        className="flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        Lire <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer /><BackToTop /><AuthModal />
    </div>
  )
}
