import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface MarketAnalytics {
  avgPrice: number;
  totalListings: number;
  totalInquiries: number;
  hotLocation: string;
  marketInsight: string;
  priceHistory: Array<{
    month: string;
    avgPrice: number;
    changePercent: number;
  }>;
  propertyTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  demandHeatmap: Array<{
    city: string;
    demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    totalListings: number;
    totalInquiries: number;
  }>;
  marketTrends: Array<{
    propertyType: string;
    trend: 'RISING' | 'STABLE' | 'FALLING';
    changePercent: number;
  }>;
}

export interface AnalyticsResponse {
  success: boolean;
  data: MarketAnalytics;
}

export const getMarketAnalyticsAPI = async (token: string): Promise<MarketAnalytics> => {
  try {
    const response = await axios.get<AnalyticsResponse>(
      `${API_URL}/analytics/market`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('Get market analytics API error:', error);
    throw error.response?.data?.message || 'Failed to fetch market analytics';
  }
};

export const getAnalyticsByCity = async (
  token: string,
  city: string
): Promise<MarketAnalytics> => {
  try {
    const response = await axios.get<AnalyticsResponse>(
      `${API_URL}/analytics/market`,
      {
        params: { city },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('Get analytics by city API error:', error);
    throw error.response?.data?.message || 'Failed to fetch analytics';
  }
};

export const getAnalyticsByPropertyType = async (
  token: string,
  propertyType: string
): Promise<MarketAnalytics> => {
  try {
    const response = await axios.get<AnalyticsResponse>(
      `${API_URL}/analytics/market`,
      {
        params: { propertyType },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('Get analytics by property type API error:', error);
    throw error.response?.data?.message || 'Failed to fetch analytics';
  }
};