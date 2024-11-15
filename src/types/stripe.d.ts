interface Product {
  id: string;
  name: string;
  description: string;
  category?: string;
  stock: number;
  prices: Price[];
  images: string[];
}

interface Price {
  id: string;
  unitAmount: number;
  currency: string;
  isActive: boolean;
}
