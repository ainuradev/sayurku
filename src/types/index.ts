export interface Product {
  id: string;
  name: string;
  category: string;
  emoji: string;
  image_url?: string | null;
  price?: number;
  unit_type: "weight" | "unit";
  unit_options: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface CartItem extends Product {
  cartItemId: string; // ID unik keranjang (agar produk yang sama dengan satuan berbeda tidak menumpuk)
  quantity: number;
  selectedUnit: string; // Satuan yang dipilih user: "250gr", "1 kg", "1 ikat", dll
}

export type DeliveryMethod = "Diantar ke Rumah" | "Ambil Sendiri";
export type PaymentMethod = "Tunai (Cash)" | "QRIS / E-Wallet";

export interface CheckoutFormData {
  nama: string;
  phone: string;
  metode: DeliveryMethod | "";
  alamat: string;
  jarak: number;
  jamAntar: string;
  pembayaran: PaymentMethod | "";
  catatan: string;
}
