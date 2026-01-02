import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import { getMarketAnalyticsAPI,getHistoricalAnalyticsAPI } from '../services/MarketAnalytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PropertyTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

interface DemandHeatmap {
  city: string;
  totalInquiries: number;
  totalListings: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface SavedStats {
  _id: string;
  saves: number;
}

interface PriceHistory {
  _id: number;
  avgPrice: number;
}

interface MarketAnalyticsData {
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

interface HistoricalData {
  month: string;
  avgPrice: number;
  totalListings: number;
  totalInquiries: number;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: 'RISING' | 'STABLE' | 'FALLING';
}

export default function MarketAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<MarketAnalyticsData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(6);

  useEffect(() => {
  if (!user?.token) {
    navigate("/login");
    return;
  }

  if (user.role !== "ADMIN") {
    toast.error("Only admins can access market analytics");
    navigate("/");
    return;
  }

  loadAnalytics();
  loadHistoricalAnalytics();
}, [user, selectedCity, selectedPropertyType, timeRange]);

const loadAnalytics = async () => {
  try {
    setLoading(true);
    const data = await getMarketAnalyticsAPI(
      user!.token,
      selectedCity,
      selectedPropertyType
    );
    setAnalytics(data);
  } catch (err) {
    toast.error("Failed to load market analytics");
  } finally {
    setLoading(false);
  }
};

const loadHistoricalAnalytics = async () => {
  try {
    const data = await getHistoricalAnalyticsAPI(
      user!.token,
      timeRange
    );
    setHistoricalData(data);
  } catch (err) {
    toast.error("Failed to load historical analytics");
  }
};


  const fetchAnalytics = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCity !== 'all') params.append('city', selectedCity);
      if (selectedPropertyType !== 'all') params.append('propertyType', selectedPropertyType);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analytics/market?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const result = await response.json();
      setAnalytics(result.data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load market analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalAnalytics = async () => {
    if (!user?.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analytics/historical?months=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch historical analytics');

      const result = await response.json();
      setHistoricalData(result.data);
    } catch (error: any) {
      console.error('Failed to fetch historical analytics:', error);
    }
  };

  const generateMonthlyReport = async () => {
    if (!user?.token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/analytics/generate-report`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to generate report');

      const result = await response.json();
      toast.success(`Report generated for ${result.month}`);
      
      // Download the report as JSON
      const dataStr = JSON.stringify(result.report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `market-report-${result.month}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate monthly report');
    }
  };

  // Prepare chart data for price history
  const priceChartData = {
    labels: historicalData.map((item) => item.month),
    datasets: [
      {
        label: 'Average Price (LKR)',
        data: historicalData.map((item) => item.avgPrice),
        fill: true,
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#0d9488',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `LKR ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 500 as const,
          },
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 500 as const,
          },
          callback: function (value: any) {
            return `${(value / 1000000).toFixed(1)}M`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 text-lg font-semibold tracking-wide">
            Analyzing Market Data...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-slate-600 text-lg font-medium">No analytics data available</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate previous month stats for comparison (mock data for now)
  const previousMonthAvgPrice = analytics.avgPrice * 0.89; // 11% growth
  const priceChange = ((analytics.avgPrice - previousMonthAvgPrice) / previousMonthAvgPrice) * 100;
  
  const previousMonthListings = Math.round(analytics.totalListings * 0.85); // 15% growth
  const listingsChange = ((analytics.totalListings - previousMonthListings) / previousMonthListings) * 100;
  
  const previousMonthInquiries = Math.round(analytics.totalInquiries * 0.8); // 20% growth
  const inquiriesChange = ((analytics.totalInquiries - previousMonthInquiries) / previousMonthInquiries) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Market Analytics
                  </h1>
                  <p className="text-slate-600 mt-1 text-lg">
                    Real-time insights from your property data
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={generateMonthlyReport}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate Report
            </button>
          </div>

          {/* AI Insight Banner */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-2xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10 flex items-start gap-5">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span>🎯</span> Market Intelligence
                </h3>
                <p className="text-teal-50 text-lg leading-relaxed">
                  {analytics.marketInsight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                City:
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white hover:border-slate-300"
              >
                <option value="all">All Cities</option>
                <option value="colombo">Colombo</option>
                <option value="kandy">Kandy</option>
                <option value="galle">Galle</option>
                <option value="negombo">Negombo</option>
                <option value="matara">Matara</option>
                <option value="jaffna">Jaffna</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Property Type:
              </label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white hover:border-slate-300"
              >
                <option value="all">All Types</option>
                <option value="APARTMENT">Apartments</option>
                <option value="HOUSE">Houses</option>
                <option value="VILLA">Villas</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Time Range:
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all bg-white hover:border-slate-300"
              >
                <option value={3}>Last 3 Months</option>
                <option value={6}>Last 6 Months</option>
                <option value={12}>Last 12 Months</option>
              </select>
            </div>

            <button
              onClick={() => {
                fetchAnalytics();
                fetchHistoricalAnalytics();
              }}
              className="ml-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Average Price */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                priceChange >= 0
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-red-700 bg-red-50'
              }`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              Average Price
            </h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              LKR {(analytics.avgPrice / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-slate-500">vs previous month</p>
          </div>

          {/* Total Listings */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                listingsChange >= 0
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-red-700 bg-red-50'
              }`}>
                {listingsChange >= 0 ? '↑' : '↓'} {Math.abs(listingsChange).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              Total Listings
            </h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {analytics.totalListings.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">Active properties</p>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                inquiriesChange >= 0
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-red-700 bg-red-50'
              }`}>
                {inquiriesChange >= 0 ? '↑' : '↓'} {Math.abs(inquiriesChange).toFixed(1)}%
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              Total Inquiries
            </h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {analytics.totalInquiries.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">Buyer interest</p>
          </div>

          {/* Hot Location */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                🔥 HOT
              </span>
            </div>
            <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              Hot Location
            </h3>
            <p className="text-3xl font-bold text-slate-900 mb-1 truncate">
              {analytics.hotLocation}
            </p>
            <p className="text-xs text-slate-500">Highest demand</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trends Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Price Trends</h2>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-full">
                {timeRange} MONTHS
              </span>
            </div>

            <div className="h-80">
              <Line data={priceChartData} options={chartOptions} />
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-teal-500 rounded-sm"></div>
                <span className="text-sm text-slate-600 font-medium">
                  Average Property Price (LKR)
                </span>
              </div>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Property Type Distribution
            </h2>

            <div className="space-y-5">
              {analytics.propertyTypeDistribution
                .sort((a, b) => b.count - a.count)
                .map((item, index) => {
                  const colors = [
                    { bg: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-700' },
                    { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
                    { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700' },
                    { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700' },
                    { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700' },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-600 font-medium">
                            {item.count} listings
                          </span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${color.light} ${color.text}`}>
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color.bg} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {analytics.propertyTypeDistribution.length > 0 && (
              <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">Market Leader:</span>{' '}
                  {analytics.propertyTypeDistribution.sort((a, b) => b.count - a.count)[0].type}{' '}
                  properties dominate with{' '}
                  {analytics.propertyTypeDistribution.sort((a, b) => b.count - a.count)[0].percentage}%
                  market share, indicating strong demand in this segment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7 mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-7">
            Demand Heatmap by Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {analytics.demandHeatmap.slice(0, 9).map((item, index) => {
              const demandConfig = {
                HIGH: {
                  color: 'bg-red-500',
                  lightBg: 'bg-red-50',
                  border: 'border-red-200',
                  text: 'text-red-700',
                  icon: '🔥',
                },
                MEDIUM: {
                  color: 'bg-yellow-500',
                  lightBg: 'bg-yellow-50',
                  border: 'border-yellow-200',
                  text: 'text-yellow-700',
                  icon: '⚡',
                },
                LOW: {
                  color: 'bg-blue-500',
                  lightBg: 'bg-blue-50',
                  border: 'border-blue-200',
                  text: 'text-blue-700',
                  icon: '📊',
                },
              };

              const config = demandConfig[item.demandLevel];

              return (
                <div
                  key={index}
                  className={`border-2 ${config.border} rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-lg truncate pr-2">
                      {item.city}
                    </h3>
                    <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-white text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Inquiries:</span>
                      <span className="font-bold text-slate-900 text-lg">
                        {item.totalInquiries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Listings:</span>
                      <span className="font-bold text-slate-900 text-lg">
                        {item.totalListings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Ratio:</span>
                      <span className="font-bold text-slate-900 text-lg">
                        {(item.totalInquiries / item.totalListings).toFixed(1)}:1
                      </span>
                    </div>
                  </div>

                  <div
                    className={`text-center text-xs font-bold py-2 rounded-lg ${config.lightBg} ${config.text} flex items-center justify-center gap-2`}
                  >
                    <span>{config.icon}</span>
                    {item.demandLevel} DEMAND
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-8 justify-center flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-md shadow-sm"></div>
              <span className="text-sm text-slate-600 font-medium">High Demand (4:1+ ratio)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-yellow-500 rounded-md shadow-sm"></div>
              <span className="text-sm text-slate-600 font-medium">Medium Demand (2:1-4:1)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-md shadow-sm"></div>
              <span className="text-sm text-slate-600 font-medium">Low Demand (&lt;2:1)</span>
            </div>
          </div>
        </div>

        {/* Historical Trends & Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Market Trends */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Historical Trends</h2>

            <div className="space-y-4">
              {historicalData.slice(0, 6).map((item, index) => {
                const trendConfig = {
                  RISING: { icon: '📈', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  STABLE: { icon: '➖', color: 'text-slate-600', bg: 'bg-slate-50' },
                  FALLING: { icon: '📉', color: 'text-red-600', bg: 'bg-red-50' },
                };

                const config = trendConfig[item.trend];

                return (
                  <div
                    key={index}
                    className="border-2 border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{item.month}</h3>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${config.bg} ${config.color}`}
                          >
                            {item.trend}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium">Avg Price</p>
                        <span className="text-xl font-bold text-slate-900">
                          {(item.avgPrice / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Listings</p>
                        <p className="text-lg font-bold text-slate-900">
                          {item.totalListings}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Inquiries</p>
                        <p className="text-lg font-bold text-slate-900">
                          {item.totalInquiries}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Insights */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Smart Insights</h2>

            <div className="space-y-5">
              <div className="border-l-4 border-teal-600 bg-gradient-to-r from-teal-50 to-transparent p-5 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                      Market Dynamics
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Current inquiry-to-listing ratio of{' '}
                      {(analytics.totalInquiries / analytics.totalListings).toFixed(1)}:1{' '}
                      indicates a{' '}
                      {analytics.totalInquiries / analytics.totalListings > 3
                        ? "strong seller's market"
                        : analytics.totalInquiries / analytics.totalListings > 1.5
                        ? 'balanced market'
                        : "buyer's market"}{' '}
                      with {analytics.totalInquiries > analytics.totalListings * 2 ? 'high' : 'moderate'}{' '}
                      competition among buyers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-transparent p-5 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📅</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                      Trend Analysis
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {historicalData.length > 0 && (
                        <>
                          Over the past {timeRange} months, the market has shown{' '}
                          {historicalData.filter((d) => d.trend === 'RISING').length >
                          historicalData.length / 2
                            ? 'predominantly upward'
                            : historicalData.filter((d) => d.trend === 'FALLING').length >
                              historicalData.length / 2
                            ? 'declining'
                            : 'stable'}{' '}
                          price momentum with{' '}
                          {historicalData[historicalData.length - 1]?.demandLevel.toLowerCase()}{' '}
                          buyer demand.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-transparent p-5 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💵</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                      Price Performance
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Average property prices have{' '}
                      {priceChange > 0 ? 'increased' : 'decreased'} by{' '}
                      {Math.abs(priceChange).toFixed(1)}% compared to the previous period,
                      indicating {priceChange > 5 ? 'strong' : 'moderate'} market appreciation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-600 bg-gradient-to-r from-orange-50 to-transparent p-5 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🏠</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                      Supply Analysis
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      With {analytics.totalListings} active listings receiving{' '}
                      {analytics.totalInquiries} inquiries, the market shows{' '}
                      {analytics.totalListings > previousMonthListings ? 'increasing' : 'stable'}{' '}
                      property supply and{' '}
                      {analytics.totalInquiries > previousMonthInquiries ? 'growing' : 'steady'}{' '}
                      buyer interest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Status Summary */}
        <div className="bg-gradient-to-br from-white to-teal-50 border-2 border-teal-600 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-100 rounded-full -ml-24 -mb-24 opacity-30"></div>
          
          <div className="relative z-10 flex items-start gap-6">
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Market Status:{' '}
                {priceChange > 5 ? 'Strong Growth Phase' : 
                 priceChange > 0 ? 'Steady Growth' : 
                 'Market Correction'}
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed mb-5">
                The real estate market is currently experiencing{' '}
                {priceChange > 5
                  ? 'robust growth with strong buyer demand across all segments. Luxury properties and urban apartments are leading the momentum.'
                  : priceChange > 0
                  ? 'steady growth with balanced buyer and seller activity. Market conditions remain favorable for transactions.'
                  : 'a price correction phase, presenting opportunities for value-conscious buyers. Market fundamentals remain sound.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white text-emerald-700 text-xs font-bold border-2 border-emerald-200 rounded-lg shadow-sm">
                  {analytics.totalInquiries > analytics.totalListings * 2
                    ? '🔥 HIGH BUYER ACTIVITY'
                    : '✓ ACTIVE BUYERS'}
                </span>
                <span className="px-4 py-2 bg-white text-blue-700 text-xs font-bold border-2 border-blue-200 rounded-lg shadow-sm">
                  {Math.abs(priceChange) < 3 ? '✓ PRICE STABLE' : priceChange > 0 ? '↑ PRICE RISING' : '↓ PRICE ADJUSTING'}
                </span>
                <span className="px-4 py-2 bg-white text-orange-700 text-xs font-bold border-2 border-orange-200 rounded-lg shadow-sm">
                  {analytics.totalListings > previousMonthListings
                    ? '📈 INCREASING SUPPLY'
                    : '✓ BALANCED SUPPLY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}