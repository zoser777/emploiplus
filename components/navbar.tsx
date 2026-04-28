'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Briefcase, GraduationCap, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/lib/store'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/apropos', label: 'A propos' },
  { href: '/services', label: 'Services' },
  { href: '/offres', label: "Offres d'emploi" },
  { href: '/formations', label: 'Formations' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, user, logout, setAuthModalOpen } = useAppStore()

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#001a33] text-white/75 text-sm py-2">
        <div className="container mx-auto px-6 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-5">
            <span>📍 Ngoyo, Pointe-Noire - Brazzaville</span>
            <a href="mailto:secretariat@emploiplus.cg" className="hover:text-[#00c3ff] transition-colors">
              ✉ secretariat@emploiplus.cg
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/profile.php?id=100068691730340" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c3ff] transition-colors">
              Facebook
            </a>
            <a href="https://whatsapp.com/channel/0029Va5ObJ55Ejy5jC43x50u" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c3ff] transition-colors">
              WhatsApp
            </a>
            <a href="https://www.linkedin.com/in/emploi-plus-mda" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c3ff] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/logo.jpeg"
              alt="Emploi Plus"
              width={200}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  pathname === link.href
                    ? 'bg-[#0099ff]/10 text-[#0099ff]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0099ff]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0099ff] to-[#001a33] flex items-center justify-center text-white font-bold text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="font-medium">{user?.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/candidatures" className="flex items-center gap-2 cursor-pointer">
                      <Briefcase className="w-4 h-4" />
                      Mes candidatures
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/formations" className="flex items-center gap-2 cursor-pointer">
                      <GraduationCap className="w-4 h-4" />
                      Mes formations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profil" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Deconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:text-white"
                  onClick={() => setAuthModalOpen(true, 'login')}
                >
                  Connexion
                </Button>
                <Button
                  className="bg-[#0099ff] hover:bg-[#0066cc] text-white"
                  onClick={() => setAuthModalOpen(true, 'register')}
                >
                  S&apos;inscrire
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        pathname === link.href
                          ? 'bg-[#0099ff]/10 text-[#0099ff]'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="border-t pt-4 mt-4 flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/dashboard">
                          <Button variant="outline" className="w-full">
                            Tableau de bord
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        Deconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full border-[#0099ff] text-[#0099ff]"
                          onClick={() => setAuthModalOpen(true, 'login')}
                        >
                          Connexion
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          className="w-full bg-[#0099ff] hover:bg-[#0066cc]"
                          onClick={() => setAuthModalOpen(true, 'register')}
                        >
                          S&apos;inscrire
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  )
}
