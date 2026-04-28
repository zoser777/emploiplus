'use client'

import { MapPin, Briefcase, Bookmark, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

interface Job {
  id: string | number
  title: string
  company: string
  sector: string
  city: string
  type: string
  exp: string
  salary: string
  date: string
  logo: string
  color: string
  desc: string
  tags: string[]
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { setApplyModalOpen, toggleSaveJob, isJobSaved, isLoggedIn, setAuthModalOpen } = useAppStore()
  const saved = isJobSaved(Number(job.id))

  const handleSave = () => {
    if (!isLoggedIn) { setAuthModalOpen(true, 'login'); return }
    toggleSaveJob(Number(job.id))
    toast.success(saved ? 'Offre retirée des favoris' : 'Offre sauvegardée !')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 transition-all hover:border-[#0099ff] hover:shadow-lg hover:-translate-y-1 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: job.color }}>
            {job.logo}
          </div>
          <div>
            <h3 className="font-bold text-[#001a33] text-sm leading-tight line-clamp-2">{job.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
          </div>
        </div>
        <button onClick={handleSave}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${saved ? 'text-[#0099ff]' : 'text-gray-300 hover:text-[#0099ff]'}`}>
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="bg-[#0099ff]/10 text-[#0099ff] text-xs">{job.type}</Badge>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs flex items-center gap-1">
          <MapPin className="w-3 h-3" />{job.city}
        </Badge>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">{job.exp}</Badge>
      </div>

      {/* Description */}
      {job.desc && <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{job.desc}</p>}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs font-semibold text-[#0099ff]">{job.salary}</p>
          <p className="text-xs text-gray-400">{job.date}</p>
        </div>
        <Button size="sm" onClick={() => setApplyModalOpen(true, job as any)}
          className="bg-[#0099ff] hover:bg-[#0066cc] text-white text-xs px-4">
          Postuler
        </Button>
      </div>
    </div>
  )
}
