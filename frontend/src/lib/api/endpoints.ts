// ═══════════════════════════════════════════════
// Sayona Shipping — API Endpoint Functions
// ═══════════════════════════════════════════════

import { apiClient } from "./client";
import type {
  TrackingResult,
  Contact,
  Quote,
  AuthTokens,
  Shipment,
  DashboardStats,
  User,
} from "@/lib/types";

// ─── Public Endpoints ───

export function getTracking(trackingId: string) {
  return apiClient.get<TrackingResult>(
    `/tracking/${encodeURIComponent(trackingId)}`
  );
}

export function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  origin?: string;
  destination?: string;
  industry?: string;
  message?: string;
}) {
  return apiClient.post<Contact>("/contacts", data);
}

export function submitQuote(data: {
  cargo: string;
  origin: string;
  destination: string;
  email: string;
}) {
  return apiClient.post<Quote>("/quotes", data);
}

// ─── Auth Endpoints ───

export function login(data: { email: string; password: string }) {
  return apiClient.post<AuthTokens>("/auth/login", data);
}

export function register(data: {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}) {
  return apiClient.post<AuthTokens>("/auth/register", data);
}

export function updateProfile(data: Partial<User>) {
  return apiClient.put<User>("/auth/profile", data);
}

// ─── Admin Endpoints ───

export function getDashboardStats() {
  return apiClient.get<DashboardStats>("/admin/dashboard");
}

export function getShipments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  return apiClient.get<{ shipments: Shipment[]; total: number }>(
    `/shipments${qs ? `?${qs}` : ""}`
  );
}

export function getShipment(id: string) {
  return apiClient.get<Shipment>(`/shipments/${id}`);
}

export function createShipment(data: Partial<Shipment>) {
  return apiClient.post<Shipment>("/shipments", data);
}

export function updateShipmentStatus(
  id: string,
  data: {
    status: string;
    location: string;
    description?: string;
  }
) {
  return apiClient.patch<Shipment>(`/shipments/${id}/status`, data);
}

export function getContacts(params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiClient.get<{ contacts: Contact[]; total: number }>(
    `/contacts${qs ? `?${qs}` : ""}`
  );
}

export function getQuotes(params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiClient.get<{ quotes: Quote[]; total: number }>(
    `/quotes${qs ? `?${qs}` : ""}`
  );
}

export function replyToQuote(uuid: string, data: { message: string; estimatedPrice: string | number }) {
  return apiClient.post<{ message: string }>(`/quotes/${uuid}/reply`, data);
}

export function getUsers() {
  return apiClient.get<User[]>("/users");
}
