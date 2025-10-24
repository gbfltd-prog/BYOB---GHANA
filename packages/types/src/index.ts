export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  AGENT = "AGENT",
  MANUFACTURER = "MANUFACTURER",
}

export enum OrderStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum WalletTxnType {
  COMMISSION_CREDIT = "COMMISSION_CREDIT",
  TRANSFER_IN = "TRANSFER_IN",
  TRANSFER_OUT = "TRANSFER_OUT",
  Payout = "PAYOUT"
}

export enum PayoutStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum MessageType {
  TEXT = "TEXT",
  VOICE = "VOICE"
}

export interface JwtUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface CommissionRule {
  // flexible JSON structure per product
  type: "FLAT" | "PERCENT";
  value: number; // cedis for FLAT, percentage (0-100) for PERCENT
}

export interface WarehouseLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface EmployabilityBreakdown {
  communication: number;
  problemSolving: number;
  professionalism: number;
  digitalFluency: number;
  teamwork: number;
  weightedScore: number;
}
