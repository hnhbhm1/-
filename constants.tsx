
import { AppState } from './types';

export const DEFAULT_IMAGE = 'https://i.ibb.co/rRq8TGwg/image.jpg';
export const DEFAULT_WHATSAPP = '+967735670700';
export const STORE_NAME = 'ترند كارد (Trend Card)';

export const INITIAL_STATE: AppState = {
  currencies: [
    { id: '1', code: 'USD', name: 'دولار أمريكي', symbol: '$', rate: 1, isActive: true },
    { id: '2', code: 'YER', name: 'ريال يمني', symbol: 'ر.ي', rate: 535, isActive: true },
    { id: '3', code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', rate: 3.75, isActive: true },
  ],
  categories: [
    { id: 'games', name: 'شحن الألعاب', image: DEFAULT_IMAGE },
    { id: 'apps', name: 'شحن البرامج', image: DEFAULT_IMAGE },
    { id: 'cards', name: 'البطاقات الإلكترونية', image: DEFAULT_IMAGE },
  ],
  products: [
    {
      id: 'p1',
      name: 'شدات ببجي',
      categoryId: 'games',
      image: DEFAULT_IMAGE,
      hasTiers: true,
      tiers: [
        { id: 't1', name: '60 شدة', priceUSD: 0.99 },
        { id: 't2', name: '325 شدة', priceUSD: 4.99 },
        { id: 't3', name: '660 شدة', priceUSD: 9.99 },
      ],
      whatsappNumber: DEFAULT_WHATSAPP
    },
    {
      id: 'p2',
      name: 'شحن يويو (Yoyo)',
      categoryId: 'apps',
      image: DEFAULT_IMAGE,
      hasTiers: false,
      minQuantity: 1000,
      pricePerMinUSD: 0.8053,
      whatsappNumber: DEFAULT_WHATSAPP
    }
  ],
  payments: [
    { id: '1', name: 'كريمي', isActive: true },
    { id: '2', name: 'النجم', isActive: true },
    { id: '3', name: 'تحويل يدوي', isActive: true },
  ]
};
