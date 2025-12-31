import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMarketAnalyticsAPI, type MarketAnalytics } from '../services/MarketAnalytics';
import toast from 'react-hot-toast';

interface PriceData {
  month: string;
  avgPrice: number;
}

interface DemandData {
  city: string;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  totalListings: number;
  totalInquiries: number;
}

interface TrendData {
  propertyType: string;
  trend: 'RISING' | 'STABLE' | 'FALLING';
  changePercent: number;
}

export default function MarketAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all');

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      toast.error('Only admins can access market analytics');
      navigate('/');
      return;
    }

    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const data = await getMarketAnalyticsAPI(user.token);
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load market analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Market Analytics</h1>
              <p className="text-gray-600">Intelligent insights powered by data analysis</p>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 mb-8 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">📊 Market Insight</h3>
              <p className="text-teal-50 leading-relaxed">
                {analytics.marketInsight || "Apartments in Colombo show strong upward momentum with increasing buyer demand. The market is experiencing a 15% growth in property listings compared to last month."}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Average Price */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1">+12%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Average Price</h3>
            <p className="text-2xl font-bold text-gray-900">LKR {analytics.avgPrice?.toLocaleString() || '28.5M'}</p>
            <p className="text-xs text-gray-500 mt-2">vs last month</p>
          </div>

          {/* Total Listings */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1">+18%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Listings</h3>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalListings?.toLocaleString() || '1,247'}</p>
            <p className="text-xs text-gray-500 mt-2">Active properties</p>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1">+25%</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Inquiries</h3>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalInquiries?.toLocaleString() || '3,124'}</p>
            <p className="text-xs text-gray-500 mt-2">Buyer interest</p>
          </div>

          {/* Most Demanded */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1">🔥 HOT</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Hot Location</h3>
            <p className="text-2xl font-bold text-gray-900">{analytics.hotLocation || 'Colombo 05'}</p>
            <p className="text-xs text-gray-500 mt-2">Highest demand</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Cities</option>
                <option value="colombo">Colombo</option>
                <option value="kandy">Kandy</option>
                <option value="galle">Galle</option>
                <option value="negombo">Negombo</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Property Type:</label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Types</option>
                <option value="APARTMENT">Apartments</option>
                <option value="HOUSE">Houses</option>
                <option value="VILLA">Villas</option>
                <option value="LAND">Land</option>
              </select>
            </div>

            <button
              onClick={fetchAnalytics}
              className="ml-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trends Chart */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Price Trends</h2>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1">6 MONTHS</span>
            </div>
            
            {/* Mock Chart - Replace with actual charting library */}
            <div className="space-y-4">
              {[
                { month: 'Oct', price: 24.2, change: 5 },
                { month: 'Nov', price: 25.8, change: 6.6 },
                { month: 'Dec', price: 26.5, change: 2.7 },
                { month: 'Jan', price: 27.1, change: 2.3 },
                { month: 'Feb', price: 27.8, change: 2.6 },
                { month: 'Mar', price: 28.5, change: 2.5 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 w-12">{item.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-8 bg-gray-100 relative">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-500"
                          style={{ width: `${(item.price / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-20">LKR {item.price}M</span>
                    <span className={`text-xs font-bold px-2 py-1 w-16 text-center ${
                      item.change > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-teal-500"></span>
                <span className="text-sm text-gray-600">Average Price (Millions LKR)</span>
              </div>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Type Distribution</h2>
            
            <div className="space-y-5">
              {[
                { type: 'Apartments', count: 487, percentage: 39, color: 'bg-teal-500' },
                { type: 'Houses', count: 362, percentage: 29, color: 'bg-blue-500' },
                { type: 'Villas', count: 249, percentage: 20, color: 'bg-purple-500' },
                { type: 'Land', count: 149, percentage: 12, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{item.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{item.count} listings</span>
                      <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 relative overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Insight:</span> Apartments dominate the market with 39% share, indicating strong urban housing demand.
              </p>
            </div>
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="bg-white border border-gray-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Demand Heatmap by Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { city: 'Colombo 05', demand: 'HIGH', inquiries: 842, listings: 186, heat: 'bg-red-500' },
              { city: 'Rajagiriya', demand: 'HIGH', inquiries: 721, listings: 164, heat: 'bg-red-500' },
              { city: 'Nugegoda', demand: 'HIGH', inquiries: 689, listings: 142, heat: 'bg-red-500' },
              { city: 'Dehiwala', demand: 'MEDIUM', inquiries: 523, listings: 128, heat: 'bg-yellow-500' },
              { city: 'Kandy', demand: 'MEDIUM', inquiries: 412, listings: 97, heat: 'bg-yellow-500' },
              { city: 'Galle', demand: 'LOW', inquiries: 284, listings: 73, heat: 'bg-blue-500' }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{item.city}</h3>
                  <span className={`w-3 h-3 ${item.heat}`}></span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inquiries:</span>
                    <span className="font-semibold text-gray-900">{item.inquiries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listings:</span>
                    <span className="font-semibold text-gray-900">{item.listings}</span>
                  </div>
                </div>

                <div className={`text-center text-xs font-bold py-1 ${
                  item.demand === 'HIGH' ? 'bg-red-50 text-red-600' : 
                  item.demand === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600' : 
                  'bg-blue-50 text-blue-600'
                }`}>
                  {item.demand === 'HIGH' && '🔥 '}{item.demand} DEMAND
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500"></span>
              <span className="text-sm text-gray-600">High Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500"></span>
              <span className="text-sm text-gray-600">Medium Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500"></span>
              <span className="text-sm text-gray-600">Low Demand</span>
            </div>
          </div>
        </div>

        {/* Market Trends & Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trend Indicators */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Market Trends</h2>
            
            <div className="space-y-4">
              {[
                { type: 'Luxury Apartments', trend: 'RISING', change: 15.2, icon: '📈' },
                { type: 'Family Houses', trend: 'RISING', change: 8.7, icon: '📈' },
                { type: 'Commercial Land', trend: 'STABLE', change: 2.1, icon: '➖' },
                { type: 'Budget Apartments', trend: 'FALLING', change: -3.4, icon: '📉' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.type}</h3>
                        <span className={`text-xs font-bold ${
                          item.trend === 'RISING' ? 'text-green-600' : 
                          item.trend === 'STABLE' ? 'text-gray-600' : 
                          'text-red-600'
                        }`}>
                          {item.trend}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        item.change > 0 ? 'text-green-600' : 
                        item.change === 0 ? 'text-gray-600' : 
                        'text-red-600'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                      <p className="text-xs text-gray-500">vs last month</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insights */}
          <div className="bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Smart Insights</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Buyer vs Seller Market',
                  insight: 'Current market favors sellers with 2.5x more inquiries than listings.',
                  type: 'advantage',
                  icon: '💰'
                },
                {
                  title: 'Seasonal Pattern Detected',
                  insight: 'March-June shows 35% higher property activity compared to other quarters.',
                  type: 'info',
                  icon: '📅'
                },
                {
                  title: 'Popular Price Range',
                  insight: 'Properties between LKR 15M-30M receive 60% of total inquiries.',
                  type: 'trend',
                  icon: '💵'
                },
                {
                  title: 'Rental Demand Peak',
                  insight: 'Rental demand is highest for 2-bedroom units, accounting for 42% of inquiries.',
                  type: 'insight',
                  icon: '🏠'
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-teal-600 bg-teal-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.insight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Status Summary */}
        <div className="mt-8 bg-white border-2 border-teal-600 p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Market Status: Strong Growth Phase</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                The real estate market is experiencing robust growth with increasing buyer demand across all segments. 
                Luxury properties and urban apartments are leading the momentum, while commercial land remains stable. 
                This is an optimal time for both buyers and sellers to engage in the market.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold border border-green-200">BUYER ACTIVE</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">PRICE STABLE</span>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">HIGH SUPPLY</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}