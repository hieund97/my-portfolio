import {
    HiCode,
    HiOfficeBuilding,
    HiShoppingCart,
    HiTemplate,
} from 'react-icons/hi';

export const VND_RATE = 26000;

export const websiteTypes = [
  {
    id: 'landing',
    nameKey: 'pricing.types.landing.name',
    descKey: 'pricing.types.landing.desc',
    icon: HiTemplate,
    basePrice: 150,
    baseDays: 7,
    features: [
      { id: 'responsive', nameKey: 'pricing.features.responsive', price: 30 },
      { id: 'animation', nameKey: 'pricing.features.animation', price: 50 },
      { id: 'seo', nameKey: 'pricing.features.seo', price: 20 },
      { id: 'contact-form', nameKey: 'pricing.features.contactForm', price: 20 },
      { id: 'analytics', nameKey: 'pricing.features.analytics', price: 20 },
    ],
  },
  {
    id: 'business',
    nameKey: 'pricing.types.business.name',
    descKey: 'pricing.types.business.desc',
    icon: HiOfficeBuilding,
    basePrice: 400,
    baseDays: 14,
    features: [
      { id: 'responsive', nameKey: 'pricing.features.responsive', price: 30 },
      { id: 'cms', nameKey: 'pricing.features.cms', price: 120 },
      { id: 'blog', nameKey: 'pricing.features.blog', price: 80 },
      { id: 'seo', nameKey: 'pricing.features.seo', price: 50 },
      { id: 'multi-lang', nameKey: 'pricing.features.multiLang', price: 80 },
      { id: 'contact-form', nameKey: 'pricing.features.contactForm', price: 20 },
    ],
  },
  {
    id: 'ecommerce',
    nameKey: 'pricing.types.ecommerce.name',
    descKey: 'pricing.types.ecommerce.desc',
    icon: HiShoppingCart,
    basePrice: 700,
    baseDays: 21,
    features: [
      { id: 'responsive', nameKey: 'pricing.features.responsive', price: 30 },
      { id: 'payment', nameKey: 'pricing.features.payment', price: 150 },
      { id: 'inventory', nameKey: 'pricing.features.inventory', price: 100 },
      { id: 'auth', nameKey: 'pricing.features.auth', price: 80 },
      { id: 'admin', nameKey: 'pricing.features.admin', price: 150 },
      { id: 'seo', nameKey: 'pricing.features.seo', price: 50 },
    ],
  },
  {
    id: 'webapp',
    nameKey: 'pricing.types.webapp.name',
    descKey: 'pricing.types.webapp.desc',
    icon: HiCode,
    basePrice: 1000,
    baseDays: 30,
    features: [
      { id: 'auth', nameKey: 'pricing.features.auth', price: 300 },
      { id: 'api', nameKey: 'pricing.features.api', price: 400 },
      { id: 'realtime', nameKey: 'pricing.features.realtime', price: 500 },
      { id: 'admin', nameKey: 'pricing.features.admin', price: 500 },
      { id: 'deploy', nameKey: 'pricing.features.deploy', price: 400 },
      { id: 'testing', nameKey: 'pricing.features.testing', price: 300 },
    ],
  },
];
