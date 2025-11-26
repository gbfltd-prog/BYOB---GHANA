export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SUPERVISOR"
  | "AGENT"
  | "MANUFACTURER"
  | "CUSTOMER";

export interface UserDTO {
  id: string;
  email: string;
  role: UserRole;
  ghanaCardNumber: string;
  accountNo: string;
  createdAt: string;
}

export interface AgentProfileDTO {
  id: string;
  userId: string;
  supervisorId?: string;
  storefrontTheme?: string;
  slogan?: string;
  totalCommission: number;
}

export interface ManufacturerProfileDTO {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  verified: boolean;
}

export interface CommissionSchemeDTO {
  id: string;
  productId: string;
  rules: Record<string, unknown>;
}

export interface WarehouseDTO {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ProductDTO {
  id: string;
  manufacturerId: string;
  title: string;
  description: string;
  price: number;
  commissionScheme: CommissionSchemeDTO;
  images: ProductImageDTO[];
  stockByWarehouse: InventoryDTO[];
}

export interface ProductImageDTO {
  id: string;
  productId: string;
  url: string;
  watermark?: string;
}

export interface InventoryDTO {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: number;
}

export interface ChatMessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: "TEXT" | "VOICE";
  createdAt: string;
}

export interface EmployabilityScoreDTO {
  id: string;
  agentId: string;
  communication: number;
  problemSolving: number;
  professionalism: number;
  digitalFluency: number;
  teamwork: number;
  weightedScore: number;
  certificateUrl?: string;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItemDTO {
  productId: string;
  quantity: number;
  price: number;
  commission: number;
}

export interface OrderDTO {
  id: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  warehouseId?: string;
  latitude: number;
  longitude: number;
  total: number;
  commissionTotal: number;
  status: OrderStatus;
  items: OrderItemDTO[];
}

export type WalletTxnType = "COMMISSION" | "TRANSFER" | "PAYOUT";

export interface WalletDTO {
  id: string;
  userId: string;
  balance: number;
}

export interface WalletTxnDTO {
  id: string;
  walletId: string;
  amount: number;
  type: WalletTxnType;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type PayoutStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";

export interface PayoutRequestDTO {
  id: string;
  walletId: string;
  amount: number;
  status: PayoutStatus;
  requiresSuperAdminApproval: boolean;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
