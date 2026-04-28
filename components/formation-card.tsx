'use client'

import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'

interface Formation {
  id: string | number
  title: string
  desc: string
  duration: string
  level: string
  price: string
  emoji: string
  bg: string
}

interface FormationCardProps {
  formation: Formation
}

export function FormationCard({ formation }: FormationCardProps) {
  const { setFormationModalOpen } = useAppStore()

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all hover:border-[#0099ff] hover:shadow-lg hover:-translate-y-1">
      <div className="h-32 flex items-center justify-center text-5xl" style={{ background: formation.bg }}>
        {formation.emoji}
      </div>
      <div className="p-5">
        <Badge variant="secondary" className="bg-[#0099ff]/10 text-[#0099ff] mb-3">{formation.level}</Badge>
        <h3 className="font-bold text-[#001a33] mb-2">{formation.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{formation.desc}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Clock className="w-4 h-4" />{formation.duration}
          </span>
          <span className="font-bold text-[#0099ff]">{formation.price}</span>
        </div>
        <Button className="w-full mt-4 bg-[#0099ff] hover:bg-[#0066cc]"
          onClick={() => setFormationModalOpen(true, String(formation.id) as any)}>
          S&apos;inscrire
        </Button>
      </div>
    </div>
  )
}
