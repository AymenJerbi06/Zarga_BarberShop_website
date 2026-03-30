import { Barber, Service } from "./types";

export const SERVICES: Service[] = [
  {
    id: "coupe-simple",
    name: "Coupe Simple",
    category: "Coupe de Cheveux",
    price: 20,
    duration: 30,
    description:
      "Coupe classique taillée avec précision. Inclut le lavage et le styling final.",
  },
  {
    id: "coupe-lavage",
    name: "Coupe + Lavage",
    category: "Coupe de Cheveux",
    price: 25,
    duration: 45,
    description:
      "Coupe soignée avec lavage professionnel et soin du cuir chevelu.",
  },
  {
    id: "coupe-enfant",
    name: "Coupe Enfant",
    category: "Coupe de Cheveux",
    price: 15,
    duration: 25,
    description: "Coupe adaptée aux enfants dans un environnement détendu.",
  },
  {
    id: "transformation",
    name: "Transformation",
    category: "Coupe de Cheveux",
    price: 40,
    priceFrom: true,
    duration: 60,
    description:
      "Changement de look complet sur mesure. Consultation gratuite incluse.",
    requiresConsultation: true,
  },
  {
    id: "taille-barbe",
    name: "Taille de Barbe",
    category: "Barbe",
    price: 15,
    duration: 20,
    description: "Taille et mise en forme de la barbe avec finition soignée.",
  },
  {
    id: "rasage-classique",
    name: "Rasage Classique",
    category: "Barbe",
    price: 20,
    duration: 30,
    description:
      "Rasage traditionnel au coupe-chou avec serviette chaude et baume après-rasage.",
  },
  {
    id: "barbe-contour",
    name: "Barbe + Contour",
    category: "Barbe",
    price: 20,
    duration: 25,
    description:
      "Taille de barbe précise avec contour net et finition impeccable.",
  },
  {
    id: "coupe-barbe",
    name: "Coupe + Barbe",
    category: "Forfaits",
    price: 35,
    duration: 50,
    description: "Le combo essentiel : coupe soignée et taille de barbe.",
  },
  {
    id: "coupe-barbe-lavage",
    name: "Coupe + Barbe + Lavage",
    category: "Forfaits",
    price: 40,
    duration: 60,
    description:
      "Notre forfait complet : coupe, soin de la barbe et lavage premium.",
  },
  {
    id: "look-complet",
    name: "Look Complet",
    category: "Forfaits",
    price: 50,
    duration: 75,
    description:
      "L'expérience ultime du gentleman : coupe, barbe, lavage, sourcils et styling.",
  },
  {
    id: "lavage",
    name: "Lavage",
    category: "Extras",
    price: 10,
    duration: 15,
    description:
      "Lavage professionnel avec produits premium et massage du cuir chevelu.",
  },
  {
    id: "sourcils",
    name: "Sourcils",
    category: "Extras",
    price: 10,
    duration: 10,
    description: "Mise en forme et taille des sourcils pour un regard affûté.",
  },
  {
    id: "coloration",
    name: "Coloration",
    category: "Extras",
    price: 30,
    priceFrom: true,
    duration: 45,
    description:
      "Coloration cheveux ou barbe avec produits de qualité professionnelle.",
    requiresConsultation: true,
  },
];

export const BARBERS: Barber[] = [
  {
    id: "zarga",
    name: "Zarga",
    title: "Fondateur & Maître Barbier",
    specialties: ["Fades & Dégradés", "Styles Modernes", "Transformations"],
    phone: "+216 22681287",
    bio: "Avec plus de 15 ans d'expérience, Zarga a fondé ce salon avec une vision : offrir à chaque client l'excellence du barbier traditionnel avec les techniques modernes les plus pointues. Maître dans l'art du dégradé, il a formé une équipe d'élite.",
    image: "/images/profile.jpg",
  },
  {
    id: "cherif",
    name: "Cherif",
    title: "Barbier Senior",
    specialties: ["Coupes Classiques", "Soins de Barbe", "Rasage Traditionnel"],
    phone: "+216 22477066",
    bio: "Cherif est le gardien des traditions barbières. Spécialiste des coupes classiques et du rasage au coupe-chou, il perpétue l'art du barbier avec une précision et un souci du détail qui lui valent une clientèle fidèle.",
    image: "/images/profile.jpg",
  },
  {
    id: "guidara",
    name: "Guidara",
    title: "Barbier & Artiste",
    specialties: ["Hair Art & Designs", "Coupes Créatives", "Motifs Géométriques"],
    phone: "+216 51410917",
    bio: "Guidara repousse les limites du barbier traditionnel. Véritable artiste, il transforme chaque coupe en œuvre d'art. Ses designs géométriques et ses motifs capillaires sont reconnaissables entre tous.",
    image: "/images/profile.jpg",
  },
];

export const SERVICE_CATEGORIES = [
  "Coupe de Cheveux",
  "Barbe",
  "Forfaits",
  "Extras",
] as const;

export const BUSINESS_HOURS = {
  weekdays: { open: "09:00", close: "20:00", label: "Lun - Sam  9h00 - 20h00" },
  sunday: { open: "09:00", close: "16:00", label: "Dimanche  9h00 - 16h00" },
};

export const SHOP_INFO = {
  name: "Zarga Gentlemen's Barber Shop",
  address: "Route L'Afrane Km 4, Sfax 3052, Tunisie",
  coordinates: { lat: 34.765542, lng: 10.724713 },
  phones: ["+216 22681287", "+216 22477066", "+216 51410917"],
  email: "contact@zarga-barbershop.tn",
};

export const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Ahmed B.",
    rating: 5,
    text: "Meilleur barbier de Sfax sans hésitation. Zarga est un vrai artiste, la coupe était parfaite. Je reviens chaque mois.",
    date: "Mars 2026",
  },
  {
    id: 2,
    name: "Mohamed K.",
    rating: 5,
    text: "Cherif m'a fait un rasage classique incroyable. L'ambiance du salon est premium, on se sent comme un vrai gentleman.",
    date: "Février 2026",
  },
  {
    id: 3,
    name: "Yassine T.",
    rating: 5,
    text: "Guidara a réalisé un design époustouflant. Les gens dans la rue m'ont arrêté pour me demander qui avait fait ma coupe !",
    date: "Mars 2026",
  },
  {
    id: 4,
    name: "Slim R.",
    rating: 5,
    text: "Service impeccable, produits de qualité, équipe professionnelle. Le forfait Look Complet vaut chaque dinar. Je recommande !",
    date: "Janvier 2026",
  },
  {
    id: 5,
    name: "Khalil M.",
    rating: 5,
    text: "J'ai emmené mon fils pour sa première vraie coupe chez Zarga. L'équipe l'a mis à l'aise immédiatement. Super expérience.",
    date: "Mars 2026",
  },
];
