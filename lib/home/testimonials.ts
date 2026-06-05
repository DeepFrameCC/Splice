export interface Testimonial {
  id: string;
  quote: string;
  highlight: string;
  author: string;
  company: string;
  location: string;
  service: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "01",
    quote: "Un rendu pro, livré rapidement. Ils ont su capter l'univers de notre marque dès la première session.",
    highlight: "capter l'univers de notre marque",
    author: "Pixel 404",
    company: "Pixel 404",
    location: "Orléans",
    service: "Pub réseaux",
    date: "Février 2026",
  },
  {
    id: "02",
    quote: "Des vidéos de qualité cinéma pour nos réseaux. Notre taux d'engagement a explosé en moins d'un mois.",
    highlight: "taux d'engagement a explosé",
    author: "CKCleanAuto45",
    company: "CKCleanAuto45",
    location: "Saran",
    service: "Pub automobile",
    date: "Avril 2026",
  },
  {
    id: "03",
    quote: "Une équipe à l'écoute, un tournage fluide et efficace. Le résultat dépasse toutes nos attentes.",
    highlight: "dépasse toutes nos attentes",
    author: "Bistrot Croix Morin",
    company: "Bistrot Croix Morin",
    location: "Orléans",
    service: "Pub locale",
    date: "Mars 2026",
  }
];
