import { useState } from 'react';
import {TrendingUpIcon, EyeIcon,MessageIcon,HeartIcon,CalendarIcon,BarChartIcon,MapPinIcon} from "../components/Icons"

export default function ViewAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  // Mock analytics data
  const overallStats = {
    totalViews: 1330,
    totalInquiries: 77,
    totalFavorites: 156,
    avgViewsPerListing: 266,
    viewsGrowth: 23,
    inquiriesGrowth: 15,
    conversionRate: 5.8,
  };

  const listings = [
    {
      id: 1,
      title: 'Cinnamon Gardens Villa',
      location: 'Colombo 7',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      views: 245,
      inquiries: 12,
      favorites: 34,
      conversionRate: 4.9,
      trend: 'up',
      viewsChange: 18,
    },
    {
      id: 2,
      title: 'Marine Drive Luxury Suite',
      location: 'Colombo 4',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      views: 328,
      inquiries: 18,
      favorites: 42,
      conversionRate: 5.5,
      trend: 'up',
      viewsChange: 25,
    },
    {
      id: 3,
      title: 'Galle Fort Heritage Home',
      location: 'Galle',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      views: 156,
      inquiries: 8,
      favorites: 19,
      conversionRate: 5.1,
      trend: 'down',
      viewsChange: -8,
    },
    {
      id: 4,
      title: 'Kandy Lake View Apartment',
      location: 'Kandy',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      views: 189,
      inquiries: 15,
      favorites: 28,
      conversionRate: 7.9,
      trend: 'up',
      viewsChange: 32,
    },
    {
      id: 5,
      title: 'Mount Lavinia Beach Villa',
      location: 'Mount Lavinia',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      views: 412,
      inquiries: 24,
      favorites: 33,
      conversionRate: 5.8,
      trend: 'up',
      viewsChange: 41,
    },
  ];

  const weeklyData = [
    { day: 'Mon', views: 45, inquiries: 3 },
    { day: 'Tue', views: 62, inquiries: 5 },
    { day: 'Wed', views: 78, inquiries: 7 },
    { day: 'Thu', views: 55, inquiries: 4 },
    { day: 'Fri', views: 89, inquiries: 9 },
    { day: 'Sat', views: 134, inquiries: 12 },
    { day: 'Sun', views: 98, inquiries: 8 },
  ];

  const maxViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your property listing performance</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-100 p-1">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                timeRange === '7days' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                timeRange === '30days' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                timeRange === '90days' ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <EyeIcon />
              <span className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <TrendingUpIcon />
                +{overallStats.viewsGrowth}%
              </span>
            </div>
            <div className="text-3xl font-bold">{overallStats.totalViews.toLocaleString()}</div>
            <div className="text-blue-100 text-sm mt-1">Total Views</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <MessageIcon />
              <span className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <TrendingUpIcon />
                +{overallStats.inquiriesGrowth}%
              </span>
            </div>
            <div className="text-3xl font-bold">{overallStats.totalInquiries}</div>
            <div className="text-green-100 text-sm mt-1">Total Inquiries</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <HeartIcon />
            </div>
            <div className="text-3xl font-bold">{overallStats.totalFavorites}</div>
            <div className="text-red-100 text-sm mt-1">Total Favorites</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <BarChartIcon />
            </div>
            <div className="text-3xl font-bold">{overallStats.conversionRate}%</div>
            <div className="text-purple-100 text-sm mt-1">Conversion Rate</div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CalendarIcon />
              Weekly Activity
            </h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span className="text-gray-600">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Inquiries</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">{data.day}</div>
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <div 
                      className="bg-teal-500 h-8 rounded flex items-center justify-end px-3 text-white text-sm font-medium transition-all"
                      style={{ width: `${(data.views / maxViews) * 100}%` }}
                    >
                      {data.views > 60 && data.views}
                    </div>
                    {data.views <= 60 && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 text-sm font-medium">
                        {data.views}
                      </span>
                    )}
                  </div>
                  <div className="w-20">
                    <div 
                      className="bg-green-500 h-8 rounded flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${(data.inquiries / 12) * 100}%`, minWidth: '32px' }}
                    >
                      {data.inquiries}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Performance */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Listing Performance</h2>
          
          <div className="space-y-4">
            {listings.map((listing) => (
              <div 
                key={listing.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedListing(selectedListing === listing.id ? null : listing.id)}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPinIcon />
                          {listing.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${
                          listing.trend === 'up' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendingUpIcon />
                          {listing.viewsChange > 0 ? '+' : ''}{listing.viewsChange}%
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <EyeIcon />
                          <span className="text-xs font-medium">Views</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{listing.views}</div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <MessageIcon />
                          <span className="text-xs font-medium">Inquiries</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">{listing.inquiries}</div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-600 mb-1">
                          <HeartIcon />
                          <span className="text-xs font-medium">Favorites</span>
                        </div>
                        <div className="text-2xl font-bold text-red-700">{listing.favorites}</div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <BarChartIcon />
                          <span className="text-xs font-medium">Conv. Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-700">{listing.conversionRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">💡 Performance Insights</h3>
          <div className="space-y-3 text-teal-50">
            <p>• Your Mount Lavinia Beach Villa is your top performer with 412 views this month</p>
            <p>• Kandy Lake View Apartment has the highest conversion rate at 7.9%</p>
            <p>• Weekend views are 45% higher than weekdays - consider posting new listings on Fridays</p>
            <p>• Your inquiry response rate affects conversion - aim to respond within 2 hours</p>
          </div>
        </div>
      </main>
    </div>
  );
}