import api from './Api';

const API_URL = import.meta.env.VITE_API_URL + "/api";

export interface ComparisonResult {
  keyDifferences: string;
  property1Pros: string;
  property1Cons: string;
  property2Pros: string;
  property2Cons: string;
  bestFor: string;
  recommendation: string;
}

export interface ComparisonResponse {
  success: boolean;
  data: ComparisonResult;
}

export const comparePropertiesAPI = async (
  token: string,
  property1Id: string,
  property2Id: string
): Promise<ComparisonResult> => {
  try {
    const response = await api.post<ComparisonResponse>(
      `${API_URL}/properties/compare`,
      {
        property1Id,
        property2Id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('Compare properties API error:', error);
    throw error.response?.data?.message || 'Failed to compare properties';
  }
};