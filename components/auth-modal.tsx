'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { User, Building2, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/lib/store'

export function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalOpen, login } = useAppStore()
  const [accountType, setAccountType] = useState<'candidat' | 'entreprise'>('candidat')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCity, setRegCity] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    login({
      id: '1',
      email: loginEmail,
      firstName: 'Jean',
      lastName: 'Dupont',
      city: 'Pointe-Noire',
      type: 'candidat',
    })
    
    setIsLoading(false)
    setAuthModalOpen(false)
    setLoginEmail('')
    setLoginPassword('')
    toast.success('Connexion reussie ! Bienvenue.')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regEmail || !regPassword || !regFirstName || !regLastName || !regCity) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    if (regPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caracteres.')
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    login({
      id: '1',
      email: regEmail,
      firstName: regFirstName,
      lastName: regLastName,
      city: regCity,
      type: accountType,
    })
    
    setIsLoading(false)
    setAuthModalOpen(false)
    setRegFirstName('')
    setRegLastName('')
    setRegEmail('')
    setRegPassword('')
    setRegCity('')
    toast.success('Compte cree avec succes ! Bienvenue sur Emploi Plus.')
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => setAuthModalOpen(open)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#001a33]">
            Bienvenue sur Emploi Plus
          </DialogTitle>
          <DialogDescription>
            Connectez-vous ou creez un compte pour acceder a toutes les fonctionnalites.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={authModalTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Creer un compte</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0099ff] hover:bg-[#0066cc]"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Mot de passe oublie ?{' '}
                <button type="button" className="text-[#0099ff] hover:underline">
                  Reinitialiser
                </button>
              </p>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Quel type de compte souhaitez-vous creer ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('candidat')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      accountType === 'candidat'
                        ? 'border-[#0099ff] bg-[#0099ff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`w-8 h-8 mx-auto mb-2 ${accountType === 'candidat' ? 'text-[#0099ff]' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${accountType === 'candidat' ? 'text-[#001a33]' : 'text-gray-600'}`}>
                      Candidat
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('entreprise')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      accountType === 'entreprise'
                        ? 'border-[#0099ff] bg-[#0099ff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`w-8 h-8 mx-auto mb-2 ${accountType === 'entreprise' ? 'text-[#0099ff]' : 'text-gray-400'}`} />
                    <span className={`font-semibold text-sm ${accountType === 'entreprise' ? 'text-[#001a33]' : 'text-gray-600'}`}>
                      Entreprise
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-firstname">Prenom</Label>
                  <Input
                    id="reg-firstname"
                    placeholder="Prenom"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-lastname">Nom</Label>
                  <Input
                    id="reg-lastname"
                    placeholder="Nom"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-city">Ville</Label>
                <Select value={regCity} onValueChange={setRegCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                    <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0099ff] hover:bg-[#0066cc]"
                disabled={isLoading}
              >
                {isLoading ? 'Creation...' : 'Creer mon compte'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
