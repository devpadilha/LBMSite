/**
 * Modelo de município
 */
export interface Municipality {
  id: number;
  name: string;
  state: string;
  totalBids?: number;
  totalContracts?: number;
  totalServiceOrders?: number;
  lastUpdate?: string;
  // Geographic information
  latitude?: number;
  longitude?: number;
  area?: number; // in km²
  // Demographic information
  population?: number;
  description?: string;
  // Administrative information
  mayor?: string;
  // Contact information
  phone?: string;
  email?: string;
  website?: string;
}