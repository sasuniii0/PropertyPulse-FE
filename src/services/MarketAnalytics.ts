// API Service for Market Analytics

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api/v1/analytics";

export interface PropertyTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface DemandHeatmap {
  city: string;
  totalInquiries: number;
  totalListings: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SavedStats {
  _id: string;
  saves: number;
}

export interface PriceHistory {
  _id: number;
  avgPrice: number;
}

export interface MarketAnalytics {
  avgPrice: number;
  totalListings: number;
  totalInquiries: number;
  hotLocation: string;
  propertyTypeDistribution: PropertyTypeDistribution[];
  demandHeatmap: DemandHeatmap[];
  savedStats: SavedStats[];
  priceHistory: PriceHistory[];
  marketInsight: string;
}

export interface HistoricalAnalyticsData {
  month: string;
  avgPrice: number;
  totalListings: number;
  totalInquiries: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: 'RISING' | 'STABLE' | 'FALLING';
}

export interface MonthlyReportItem {
  city: string;
  propertyType: string;
  avgPrice: number;
  totalListings: number;
  totalInquiries: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MonthlyReport {
  month: string;
  report: MonthlyReportItem[];
}

/**
 * Fetch current market analytics
 */
export const getMarketAnalyticsAPI = async (
  token: string,
  city?: string,
  propertyType?: string
): Promise<MarketAnalytics> => {
  const params = new URLSearchParams();
  if (city && city !== 'all') params.append('city', city);
  if (propertyType && propertyType !== 'all') params.append('propertyType', propertyType);

  const response = await fetch(
    `${API_BASE_URL}/market?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch market analytics');
  }

  const result = await response.json();
  return result.data;
};

/**
 * Fetch historical analytics data
 */
export const getHistoricalAnalyticsAPI = async (
  token: string,
  months: number = 6
): Promise<HistoricalAnalyticsData[]> => {
  const response = await fetch(
    `${API_BASE_URL}/historical?months=${months}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch historical analytics');
  }

  const result = await response.json();
  return result.data;
};

/**
 * Generate monthly report
 */
export const generateMonthlyReportAPI = async (
  token: string
): Promise<MonthlyReport> => {
  const response = await fetch(
    `${API_BASE_URL}/generate-report`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate monthly report');
  }

  const result = await response.json();
  return {
    month: result.month,
    report: result.report,
  };
};