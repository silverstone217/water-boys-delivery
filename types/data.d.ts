export type OrdersType = {
  id: string;
  orderId: string;
  status: string;
  quantity: number | null;
  price: number | null;
  clientName: string;
  userId: string | null;
  clientAddress: string;
  clientPhoneNumber: string;
  clientDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};
