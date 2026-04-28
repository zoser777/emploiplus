'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader, EmptyState } from '@/components/admin/AdminComponents'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageSquare, Trash2, Mail, Phone, Clock, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const load = async () => {
    const res = await fetch('/api/admin/messages')
    setMessages(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const markRead = async (msg: any) => {
    if (!msg.isRead) {
      await fetch(`/api/admin/messages/${msg.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m))
    }
    setSelected(msg)
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    toast.success('Message supprimé')
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter(m => !m.isRead).length

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Messages"
          desc={unread > 0 ? `${unread} message${unread > 1 ? 's' : ''} non lu${unread > 1 ? 's' : ''}` : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
        />

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-xl border p-4 animate-pulse h-16" />)}</div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState icon={MessageSquare} title="Aucun message" desc="Les messages du formulaire de contact apparaîtront ici" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {messages.map((msg, i) => (
              <div key={msg.id}
                className={`flex items-start gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${!msg.isRead ? 'bg-blue-50/40' : ''}`}
                onClick={() => markRead(msg)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold ${!msg.isRead ? 'bg-[#0099ff]' : 'bg-gray-300'}`}>
                  {msg.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!msg.isRead ? 'font-semibold text-[#001a33]' : 'font-medium text-gray-700'}`}>{msg.name}</p>
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[#0099ff] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject || 'Aucun sujet'} — {msg.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
                        <AlertDialogDescription>Le message de {msg.name} sera définitivement supprimé.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => del(msg.id)} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message de {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-[#0099ff]" />
                  <a href={`mailto:${selected.email}`} className="text-[#0099ff] hover:underline truncate">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-[#0099ff]" />
                    <span>{selected.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs">{new Date(selected.createdAt).toLocaleString('fr-FR')}</span>
                </div>
                {selected.subject && (
                  <div className="text-gray-600 col-span-2">
                    <span className="font-medium">Sujet : </span>{selected.subject}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Votre message'}`}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#0099ff] hover:bg-[#0077cc] text-white rounded-xl text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" />Répondre par email
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
