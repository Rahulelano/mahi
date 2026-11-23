import { Compass, Droplets, Sparkles, Truck, Zap } from 'lucide-react';
import { Service } from '../types';

export const phonePrimary = '8072745308';
export const phoneSecondary = '9159175475';
export const whatsappNumber = '918072745308';
export const email = 'thiruvenni71@gmail.com';
export const address = 'Sivanandha Colony, Tata Bate, Coimbatore - 641012';
export const mapEmbedUrl =
  'https://maps.google.com/maps?q=Sivanandha+Colony,+Tata+Bate,+Coimbatore+-+641012&t=&z=15&ie=UTF8&iwloc=&output=embed';
export const mapDirectionsUrl =
  'https://www.google.com/maps/search/?api=1&query=Sivanandha+Colony+Tata+Bate+Coimbatore+641012';

export const serviceImages = {
  electrical: '/images/electrical-works.jpg',
  plumbing: '/images/plumbing-works.jpg',
  epoxy: '/images/epoxy-works.jpg',
  cleaning: '/images/cleaning-works.jpg',
  moving: '/images/packers-and-movers.jpg',
  survey: '/images/survey-work.jpg',
};

export const services: Service[] = [
  {
    slug: 'electrical-works',
    title: 'Electrical Works',
    eyebrow: 'Power, protected',
    description: 'Safe, reliable electrical solutions for homes, shops, and growing businesses.',
    image: serviceImages.electrical,
    icon: Zap,
    color: 'orange',
    points: ['Wiring & rewiring', 'Switches and sockets', 'Fault finding & repairs', 'Lighting installation'],
  },
  {
    slug: 'plumbing-works',
    title: 'Plumbing Works',
    eyebrow: 'Flow, restored',
    description: 'Fast, neat plumbing support that keeps your water systems working beautifully.',
    image: serviceImages.plumbing,
    icon: Droplets,
    color: 'blue',
    points: ['Leak detection & repair', 'Tap and sink installation', 'Bathroom plumbing', 'Pipe replacement'],
  },
  {
    slug: 'epoxy-works',
    title: 'Epoxy Works',
    eyebrow: 'Built to last',
    description: 'Durable, smooth epoxy finishes for floors, workspaces, and high-use areas.',
    image: serviceImages.epoxy,
    icon: Sparkles,
    color: 'orange',
    points: ['Floor coating', 'Garage & workshop floors', 'Industrial finishes', 'Surface preparation'],
  },
  {
    slug: 'cleaning-works',
    title: 'Cleaning Works',
    eyebrow: 'Fresh, every time',
    description: 'Detailed cleaning services that bring a healthier, brighter feel to your space.',
    image: serviceImages.cleaning,
    icon: Sparkles,
    color: 'blue',
    points: ['Deep home cleaning', 'Office cleaning', 'Move-in cleaning', 'Glass and floor care'],
  },
  {
    slug: 'packers-and-movers',
    title: 'Packers & Movers',
    eyebrow: 'Move with ease',
    description: 'Careful packing and dependable moving support for a smooth new beginning.',
    image: serviceImages.moving,
    icon: Truck,
    color: 'orange',
    points: ['Home shifting', 'Office relocation', 'Safe packing', 'Loading and unloading'],
  },
  {
    slug: 'survey-work',
    title: 'Survey Work',
    eyebrow: 'Precision, measured',
    description: 'Accurate land, building, and boundary surveying using advanced digital total station equipment across Coimbatore.',
    image: serviceImages.survey,
    icon: Compass,
    color: 'blue',
    points: ['Land & boundary survey', 'Digital total station survey', 'Building & site layout', 'Contour & elevation mapping'],
  },
];

export function whatsappLink(message = 'Hello Mahi Electrical & Plumbing Works, I would like to enquire about your services.') {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
