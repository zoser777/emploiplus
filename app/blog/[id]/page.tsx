'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { BackToTop } from '@/components/back-to-top'
import { BLOGS } from '@/lib/data'

export default function BlogArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      // 1. Try API first
      try {
        const res = await fetch('/api/admin/blog')
        const apiPosts = await res.json()
        const allPosts = [
          ...apiPosts.filter((p: any) => p.isActive),
          ...BLOGS.filter((sb: any) => !apiPosts.some((ap: any) => ap.title === sb.title))
        ]
        const found = allPosts.find((p: any) => String(p.id) === String(id))
        if (found) {
          setPost(found)
          setRelated(allPosts.filter((p: any) => String(p.id) !== String(id)).slice(0, 2))
        }
      } catch {
        // 2. Fallback to static
        const found = BLOGS.find(b => String(b.id) === String(id))
        if (found) {
          setPost(found)
          setRelated(BLOGS.filter(b => String(b.id) !== String(id)).slice(0, 2))
        }
      }
      setLoading(false)
    }
    loadPost()
  }, [id])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = post?.title || ''
    let shareUrl = ''
    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break
      case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`; break
      case 'copy': navigator.clipboard.writeText(url); toast.success('Lien copié !'); return
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0099ff] animate-spin" />
      </div>
      <Footer />
    </div>
  )

  if (!post) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">📝</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article introuvable</h1>
          <Link href="/blog"><Button>Retour au blog</Button></Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  // Build article content: use stored content if available, else generate fallback
  const articleContent = post.content && post.content.trim().length > 30
    ? post.content
        .split('\n')
        .filter(Boolean)
        .map((p: string) => `<p>${p}</p>`)
        .join('')
    : `
      <p class="lead">${post.desc}</p>
      <h2>Introduction</h2>
      <p>Le marché de l'emploi au Congo connaît des évolutions significatives ces dernières années. 
      Que vous soyez à Brazzaville ou Pointe-Noire, comprendre ces dynamiques est essentiel pour 
      optimiser votre recherche d'emploi.</p>
      <h2>Points clés à retenir</h2>
      <ul>
        <li>Adaptez votre CV au contexte local et aux attentes des recruteurs congolais</li>
        <li>Mettez en avant vos compétences pratiques et vos réalisations concrètes</li>
        <li>Soignez votre présence sur les réseaux professionnels</li>
        <li>Préparez-vous aux questions spécifiques des entretiens locaux</li>
      </ul>
      <h2>Conseils pratiques</h2>
      <p>Pour maximiser vos chances de succès, nous vous recommandons de personnaliser chaque 
      candidature en fonction de l'entreprise visée. Les recruteurs apprécient les candidats 
      qui montrent une réelle connaissance de leur structure.</p>
      <blockquote>
        "La clé du succès réside dans la préparation et la persévérance. Chaque candidature 
        est une opportunité d'apprendre et de s'améliorer."
      </blockquote>
      <h2>Conclusion</h2>
      <p>En suivant ces conseils et en restant proactif dans votre recherche, vous augmenterez 
      considérablement vos chances de décrocher le poste de vos rêves.</p>
    `

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#0099ff] hover:text-[#0066cc] mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" />Retour au blog
          </Link>

          <article className="max-w-3xl mx-auto">
            <header className="mb-10">
              <span className="inline-flex items-center gap-2 bg-[#0099ff]/10 text-[#0099ff] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                {post.cat}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#001a33] leading-tight mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />5 min de lecture</span>
              </div>
            </header>

            {/* Featured visual */}
            <div className="h-64 md:h-80 rounded-2xl flex items-center justify-center text-8xl mb-10"
              style={{ background: post.bg }}>
              {post.emoji}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#001a33] prose-a:text-[#0099ff] prose-blockquote:border-l-[#0099ff] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-li:text-gray-700 prose-p:text-gray-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <Share2 className="w-5 h-5" />Partager cet article
                </span>
                <div className="flex gap-3">
                  {[
                    { platform: 'facebook', bg: '#1877f2', icon: <Facebook className="w-5 h-5" /> },
                    { platform: 'twitter', bg: '#1da1f2', icon: <Twitter className="w-5 h-5" /> },
                    { platform: 'linkedin', bg: '#0a66c2', icon: <Linkedin className="w-5 h-5" /> },
                  ].map(s => (
                    <button key={s.platform} onClick={() => handleShare(s.platform)}
                      className="w-10 h-10 rounded-lg text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: s.bg }}>
                      {s.icon}
                    </button>
                  ))}
                  <button onClick={() => handleShare('copy')}
                    className="px-4 h-10 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors">
                    Copier le lien
                  </button>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl text-[#001a33] mb-6">Articles similaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {related.map(rel => (
                    <Link key={rel.id} href={`/blog/${rel.id}`}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{rel.emoji}</span>
                        <span className="text-xs font-bold text-[#0099ff] uppercase tracking-wider">{rel.cat}</span>
                      </div>
                      <h3 className="font-bold text-[#001a33] group-hover:text-[#0099ff] transition-colors">{rel.title}</h3>
                      <span className="text-sm text-gray-400 mt-1 block">{rel.date}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer /><BackToTop /><AuthModal />
    </div>
  )
}
