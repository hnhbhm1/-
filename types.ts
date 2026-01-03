
export type CategoryID = 'games' | 'apps' | 'cards' | string;

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to 1 USD
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface ProductTier {
  id: string;
  name: string;
  priceUSD: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryID;
  image: string;
  hasTiers: boolean;
  // If hasTiers = true
  tiers?: ProductTier[];
  // If hasTiers = false
  minQuantity?: number;
  pricePerMinUSD?: number;
  whatsappNumber: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
  recipientName?: string;
  accountNumber?: string;
  transferNumber?: string;
}

export interface AppState {
  currencies: Currency[];
  categories: Category[];
  products: Product[];
  payments: PaymentMethod[];
}
