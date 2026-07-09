export type ZoneType = "COMMON" | "VIP" | "STREAMER";

export type PcStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export interface Computer {
  id: string;
  name: string;
  zone: ZoneType;
  status: PcStatus;
  pricePerHour: number;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  isBanned: boolean;
}
