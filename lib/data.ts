export interface Job {
  id: number
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

export interface Formation {
  id: number
  title: string
  desc: string
  duration: string
  level: string
  price: string
  emoji: string
  bg: string
}

export interface Partner {
  name: string
  sector: string
  logo: string
  color: string
}

export interface Testimonial {
  name: string
  role: string
  stars: number
  text: string
  initials: string
  color: string
}

export interface BlogPost {
  id: number
  cat: string
  title: string
  desc: string
  emoji: string
  bg: string
  date: string
}

export interface FAQ {
  q: string
  a: string
}

// ── Les tableaux statiques sont intentionnellement vides ──────────────────
// Toutes les données viennent désormais du tableau de bord (Supabase)
export const JOBS: Job[] = []
export const FORMATIONS: Formation[] = []
export const PARTNERS: Partner[] = []
export const TESTIMONIALS: Testimonial[] = []
export const BLOGS: BlogPost[] = []

export const FAQS: FAQ[] = [
  { q: "Comment postuler à une offre d'emploi ?", a: "Pour postuler, cliquez sur le bouton « Postuler » sur la page de l'offre. Remplissez le formulaire avec vos informations, indiquez le nom de votre CV et ajoutez une lettre de motivation si vous le souhaitez." },
  { q: "La plateforme est-elle gratuite pour les candidats ?", a: "Oui, l'utilisation de la plateforme est entièrement gratuite pour les chercheurs d'emploi. L'inscription, la consultation des offres et le dépôt de candidatures ne coûtent rien." },
  { q: "Comment publier une offre d'emploi en tant qu'entreprise ?", a: "Contactez-nous via le formulaire de contact ou par WhatsApp. Notre équipe créera votre offre et la publiera sur la plateforme après validation." },
  { q: "Comment contacter l'agence Emploi Plus ?", a: "Vous pouvez nous contacter via le formulaire de contact sur le site, par email à secretariat@emploiplus.cg ou par WhatsApp au 05 363 96 96. Nous sommes disponibles du lundi au vendredi de 8h à 18h." },
  { q: "Comment m'inscrire aux formations ?", a: "Dans la section Formations, cliquez sur « S'inscrire » sur la formation souhaitée. Un formulaire s'ouvrira pour recueillir vos informations. Notre équipe vous contactera pour confirmer votre inscription et les modalités de paiement." },
  { q: "Puis-je recevoir des alertes pour les nouvelles offres ?", a: "Oui ! Inscrivez-vous à notre newsletter en bas de la page d'accueil. Vous recevrez les dernières offres directement dans votre boîte mail." },
]

export const SECTORS = [
  { key: 'all',           label: 'Tous les secteurs',          icon: '🏢' },
  // Technologie & numérique
  { key: 'tech',          label: 'Informatique & IT',          icon: '💻', value: 'Informatique & IT' },
  { key: 'telecom',       label: 'Télécommunications',         icon: '📡', value: 'Télécommunications' },
  { key: 'numerique',     label: 'Marketing Digital',          icon: '📱', value: 'Marketing Digital' },
  { key: 'media',         label: 'Médias & Communication',     icon: '📰', value: 'Médias & Communication' },
  // Finance & juridique
  { key: 'finance',       label: 'Finance & Banque',           icon: '💰', value: 'Finance & Banque' },
  { key: 'assurance',     label: 'Assurance',                  icon: '🛡️', value: 'Assurance' },
  { key: 'comptabilite',  label: 'Comptabilité & Audit',       icon: '📊', value: 'Comptabilité & Audit' },
  { key: 'juridique',     label: 'Juridique & Droit',          icon: '⚖️', value: 'Juridique & Droit' },
  // Santé & social
  { key: 'sante',         label: 'Santé & Médecine',           icon: '🏥', value: 'Santé & Médecine' },
  { key: 'pharma',        label: 'Pharmacie',                  icon: '💊', value: 'Pharmacie' },
  { key: 'social',        label: 'Action sociale & ONG',       icon: '🤝', value: 'Action sociale & ONG' },
  // Éducation & formation
  { key: 'education',     label: 'Éducation & Enseignement',   icon: '📚', value: 'Éducation & Enseignement' },
  { key: 'formation',     label: 'Formation professionnelle',  icon: '🎓', value: 'Formation professionnelle' },
  // Énergie & industrie
  { key: 'petrole',       label: 'Pétrole & Gaz',              icon: '🛢️', value: 'Pétrole & Gaz' },
  { key: 'energie',       label: 'Énergie & Mines',            icon: '⚡', value: 'Énergie & Mines' },
  { key: 'industrie',     label: 'Industrie & Production',     icon: '🏭', value: 'Industrie & Production' },
  // BTP & immobilier
  { key: 'btp',           label: 'BTP & Construction',         icon: '🏗️', value: 'BTP & Construction' },
  { key: 'immobilier',    label: 'Immobilier',                 icon: '🏠', value: 'Immobilier' },
  { key: 'architecture',  label: 'Architecture & Design',      icon: '📐', value: 'Architecture & Design' },
  // Commerce & distribution
  { key: 'commerce',      label: 'Commerce & Vente',           icon: '🛒', value: 'Commerce & Vente' },
  { key: 'distribution',  label: 'Grande distribution',        icon: '🏪', value: 'Grande distribution' },
  { key: 'import_export', label: 'Import / Export',            icon: '🌍', value: 'Import / Export' },
  // Transport & logistique
  { key: 'transport',     label: 'Transport',                  icon: '🚗', value: 'Transport' },
  { key: 'logistique',    label: 'Logistique & Supply Chain',  icon: '📦', value: 'Logistique & Supply Chain' },
  { key: 'maritime',      label: 'Maritime & Portuaire',       icon: '⚓', value: 'Maritime & Portuaire' },
  { key: 'aviation',      label: 'Aviation & Aérien',          icon: '✈️', value: 'Aviation & Aérien' },
  // Agro-alimentaire & agriculture
  { key: 'agro',          label: 'Agro-alimentaire',           icon: '🍽️', value: 'Agro-alimentaire' },
  { key: 'agriculture',   label: 'Agriculture & Élevage',      icon: '🌾', value: 'Agriculture & Élevage' },
  { key: 'peche',         label: 'Pêche & Aquaculture',        icon: '🐟', value: 'Pêche & Aquaculture' },
  // Services & particuliers
  { key: 'particulier',   label: 'Particulier / Maison',       icon: '👨‍👩‍👧', value: 'Particulier / Maison' },
  { key: 'hotellerie',    label: 'Hôtellerie & Tourisme',      icon: '🏨', value: 'Hôtellerie & Tourisme' },
  { key: 'restauration',  label: 'Restauration',               icon: '🍴', value: 'Restauration' },
  { key: 'securite',      label: 'Sécurité & Gardiennage',     icon: '🔒', value: 'Sécurité & Gardiennage' },
  { key: 'nettoyage',     label: 'Nettoyage & Entretien',      icon: '🧹', value: 'Nettoyage & Entretien' },
  // Ressources humaines & admin
  { key: 'rh',            label: 'Ressources Humaines',        icon: '👥', value: 'Ressources Humaines' },
  { key: 'administration',label: 'Administration & Secrétariat',icon: '🗂️', value: 'Administration & Secrétariat' },
  { key: 'management',    label: 'Direction & Management',     icon: '🎯', value: 'Direction & Management' },
  // Créatif & culturel
  { key: 'art',           label: 'Art & Culture',              icon: '🎨', value: 'Art & Culture' },
  { key: 'audiovisuel',   label: 'Audiovisuel & Cinéma',       icon: '🎬', value: 'Audiovisuel & Cinéma' },
  { key: 'sport',         label: 'Sport & Loisirs',            icon: '⚽', value: 'Sport & Loisirs' },
  // Environnement & autre
  { key: 'environnement', label: 'Environnement & Écologie',   icon: '🌿', value: 'Environnement & Écologie' },
  { key: 'autre',         label: 'Autre / Divers',             icon: '🔧', value: 'Autre / Divers' },
]

export const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Freelance', 'Intérim', 'Temps partiel', 'Bénévolat']
export const EXPERIENCE_LEVELS = ['Débutant (0-1 an)', 'Junior (1-3 ans)', 'Confirmé (3-5 ans)', 'Senior (5+ ans)']
export const CITIES = [
  'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso',
  'Kintélé', 'Oyo', 'Bétou', 'Gamboma', 'Owando',
  'Madingou', 'Impfondo', 'Makoua', 'Sibiti', 'Mossaka',
  'Ewo', 'Djambala', 'Kinkala', 'Mossendjo', 'Loutété',
  'Bouansa', 'Boundji', 'Okoyo', 'Loango',
]
