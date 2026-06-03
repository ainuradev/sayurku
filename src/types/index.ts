export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  emoji: string; // emoji representasi produk, contoh: "🥬"
  isAvailable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type DeliveryMethod = "Diantar ke Rumah" | "Ambil Sendiri";
export type PaymentMethod = "Tunai (Cash)" | "QRIS / E-Wallet";

export interface CheckoutFormData {
  nama: string;
  metode: DeliveryMethod | "";
  alamat: string;
  jamAntar: string;
  pembayaran: PaymentMethod | "";
}
