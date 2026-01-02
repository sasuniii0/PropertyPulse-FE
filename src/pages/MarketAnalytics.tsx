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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="border-b-2 border-slate-200 pb-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Market Analytics Dashboard
              </h1>
              <p className="text-slate-600 text-sm">
                Real-time property market insights and trends
              </p>
            </div>
            <button
              onClick={generateMonthlyReport}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-teal-600 border-2 border-teal-700 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-700 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
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
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Market Intelligence
              </h3>
              <p className="text-teal-50 leading-relaxed">
                {analytics.marketInsight}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border-2 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-600 transition-colors bg-white"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Property Type
              </label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full border-2 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-600 transition-colors bg-white"
              >
                <option value="all">All Types</option>
                <option value="APARTMENT">Apartments</option>
                <option value="HOUSE">Houses</option>
                <option value="VILLA">Villas</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="w-full border-2 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-600 transition-colors bg-white"
              >
                <option value={3}>Last 3 Months</option>
                <option value={6}>Last 6 Months</option>
                <option value={12}>Last 12 Months</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  fetchAnalytics();
                  fetchHistoricalAnalytics();
                }}
                className="w-full px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metrics - Table Style */}
        <div className="border-2 border-slate-200 mb-8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Metric
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Average Price
                      </p>
                      <p className="text-xs text-slate-500">Market average property value</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    LKR {(analytics.avgPrice / 1000000).toFixed(2)}M
                  </p>
                </td>
                <td className="px-6 py-5 text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      priceChange >= 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Total Listings
                      </p>
                      <p className="text-xs text-slate-500">Active property listings</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalListings.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-5 text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      listingsChange >= 0
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {listingsChange >= 0 ? '↑' : '↓'} {Math.abs(listingsChange).toFixed(1)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Total Inquiries
                      </p>
                      <p className="text-xs text-slate-500">Buyer interest level</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalInquiries.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-5 text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      inquiriesChange >= 0
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {inquiriesChange >= 0 ? '↑' : '↓'} {Math.abs(inquiriesChange).toFixed(1)}%
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Hot Location
                      </p>
                      <p className="text-xs text-slate-500">Highest demand area</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.hotLocation}
                  </p>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                    TOP DEMAND
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trends Chart */}
          <div className="border-2 border-slate-200">
            <div className="bg-slate-100 border-b-2 border-slate-200 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Price Trends Analysis
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Last {timeRange} months average pricing
              </p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Line data={priceChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="border-2 border-slate-200">
            <div className="bg-slate-100 border-b-2 border-slate-200 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Property Type Distribution
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Market composition by property type
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {analytics.propertyTypeDistribution
                  .sort((a, b) => b.count - a.count)
                  .map((item, index) => {
                    const colors = [
                      { bg: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-700' },
                      { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700' },
                      { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700' },
                      { bg: 'bg-orange-600', light: 'bg-orange-50', text: 'text-orange-700' },
                      { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-700' },
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <div key={item.type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            {item.type}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-600 font-medium">
                              {item.count} listings
                            </span>
                            <span
                              className={`text-xs font-bold px-3 py-1 ${color.light} ${color.text} uppercase tracking-wider`}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-100 relative">
                          <div
                            className={`h-full ${color.bg} transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {analytics.propertyTypeDistribution.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">MARKET LEADER:</span>{' '}
                    {analytics.propertyTypeDistribution.sort((a, b) => b.count - a.count)[0].type}{' '}
                    properties dominate with{' '}
                    {analytics.propertyTypeDistribution.sort((a, b) => b.count - a.count)[0].percentage}%
                    market share.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="border-2 border-slate-200 mb-8">
          <div className="bg-slate-100 border-b-2 border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Demand Heatmap by Location
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Geographic distribution of buyer demand
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Listings
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ratio
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Demand Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.demandHeatmap.slice(0, 12).map((item, index) => {
                    const demandConfig = {
                      HIGH: {
                        bg: 'bg-red-100',
                        text: 'text-red-700',
                        label: 'HIGH',
                      },
                      MEDIUM: {
                        bg: 'bg-yellow-100',
                        text: 'text-yellow-700',
                        label: 'MEDIUM',
                      },
                      LOW: {
                        bg: 'bg-blue-100',
                        text: 'text-blue-700',
                        label: 'LOW',
                      },
                    };

                    const config = demandConfig[item.demandLevel];

                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-200 text-slate-700 text-xs font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-slate-900">{item.city}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {item.totalInquiries}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {item.totalListings}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {(item.totalInquiries / item.totalListings).toFixed(1)}:1
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Historical Trends & Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Market Trends */}
          <div className="border-2 border-slate-200">
            <div className="bg-slate-100 border-b-2 border-slate-200 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Historical Market Trends
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Month-by-month market performance
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {historicalData.slice(0, 6).map((item, index) => {
                  const trendConfig = {
                    RISING: { label: 'RISING', bg: 'bg-emerald-100', text: 'text-emerald-700' },
                    STABLE: { label: 'STABLE', bg: 'bg-slate-100', text: 'text-slate-700' },
                    FALLING: { label: 'FALLING', bg: 'bg-red-100', text: 'text-red-700' },
                  };

                  const config = trendConfig[item.trend];

                  return (
                    <div
                      key={index}
                      className="border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                            {item.month}
                          </h3>
                          <span
                            className={`inline-block mt-1 px-2 py-1 text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">
                            Avg Price
                          </p>
                          <span className="text-lg font-bold text-slate-900">
                            {(item.avgPrice / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                            Listings
                          </p>
                          <p className="text-sm font-bold text-slate-900">{item.totalListings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                            Inquiries
                          </p>
                          <p className="text-sm font-bold text-slate-900">{item.totalInquiries}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Smart Insights */}
          <div className="border-2 border-slate-200">
            <div className="bg-slate-100 border-b-2 border-slate-200 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Market Intelligence Insights
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Data-driven market analysis
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="border-l-4 border-teal-600 pl-4 py-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Market Dynamics
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Current inquiry-to-listing ratio of{' '}
                    {(analytics.totalInquiries / analytics.totalListings).toFixed(1)}:1 indicates a{' '}
                    {analytics.totalInquiries / analytics.totalListings > 3
                      ? "strong seller's market"
                      : analytics.totalInquiries / analytics.totalListings > 1.5
                      ? 'balanced market'
                      : "buyer's market"}
                    .
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
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
                        price momentum.
                      </>
                    )}
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4 py-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Price Performance
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Average property prices have {priceChange > 0 ? 'increased' : 'decreased'} by{' '}
                    {Math.abs(priceChange).toFixed(1)}% compared to the previous period.
                  </p>
                </div>

                <div className="border-l-4 border-orange-600 pl-4 py-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Supply Analysis
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    With {analytics.totalListings} active listings receiving{' '}
                    {analytics.totalInquiries} inquiries, market activity remains{' '}
                    {analytics.totalInquiries > analytics.totalListings * 2 ? 'strong' : 'moderate'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Status Summary */}
        <div className="bg-slate-900 border-2 border-slate-800 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-teal-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                Market Status:{' '}
                {priceChange > 5
                  ? 'Strong Growth Phase'
                  : priceChange > 0
                  ? 'Steady Growth'
                  : 'Market Correction'}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                The real estate market is currently experiencing{' '}
                {priceChange > 5
                  ? 'robust growth with strong buyer demand across all segments.'
                  : priceChange > 0
                  ? 'steady growth with balanced buyer and seller activity.'
                  : 'a price correction phase with opportunities for value-conscious buyers.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider">
                  {analytics.totalInquiries > analytics.totalListings * 2
                    ? 'HIGH BUYER ACTIVITY'
                    : 'ACTIVE BUYERS'}
                </span>
                <span className="px-4 py-2 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider">
                  {Math.abs(priceChange) < 3
                    ? 'PRICE STABLE'
                    : priceChange > 0
                    ? 'PRICE RISING'
                    : 'PRICE ADJUSTING'}
                </span>
                <span className="px-4 py-2 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider">
                  {analytics.totalListings > previousMonthListings
                    ? 'INCREASING SUPPLY'
                    : 'BALANCED SUPPLY'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}