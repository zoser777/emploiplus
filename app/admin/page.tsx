'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminStore } from '@/lib/admin-store'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const { isAdminAuthenticated, adminLogin } = useAdminStore()

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAdminAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = adminLogin(password)
    
    if (success) {
      toast.success('Connexion reussie !')
      router.push('/admin/dashboard')
    } else {
      toast.error('Mot de passe incorrect')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] to-[#0066cc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.jpeg"
              alt="Emploi Plus"
              width={180}
              height={70}
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#001a33] rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#00c3ff]" />
            </div>
            <h1 className="text-2xl font-bold text-[#001a33]">Administration</h1>
            <p className="text-gray-500 mt-2">Connectez-vous pour acceder au back-office</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#001a33]">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin"
                  className="pr-10 h-12 border-gray-300 focus:border-[#0099ff] focus:ring-[#0099ff]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 bg-[#0099ff] hover:bg-[#0077cc] text-white font-semibold"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#0099ff] transition-colors"
            >
              Retour au site
            </a>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-white/60 text-sm mt-6">
          Acces reserve aux administrateurs
        </p>
      </div>
    </div>
  )
}
