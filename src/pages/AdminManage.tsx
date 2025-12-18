// import { useState } from 'react';
// import ActionCard from '../components/ActionCard';
// import StatCard from '../components/StatCard';
// import ActivityCard from '../components/ActivityCard';

// // Icon Components (simplified versions)
// const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const ChartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
// const PulseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('overview');
  
//   // Mock data
//   const recentUsers = [
//     { id: 1, name: 'Ashan Perera', role: 'Client', date: '2 hours ago', status: 'active' },
//     { id: 2, name: 'Nimal Silva', role: 'Agent', date: '5 hours ago', status: 'active' },
//     { id: 3, name: 'Kamala Dias', role: 'Client', date: '1 day ago', status: 'pending' },
//   ];

//   const pendingListings = [
//     { id: 1, property: 'Galle Fort Heritage House', agent: 'Priya Fernando', date: '1 hour ago' },
//     { id: 2, property: 'Kandy Lake View Apartment', agent: 'Rohan Wickrama', date: '3 hours ago' },
//     { id: 3, property: 'Negombo Beach Villa', agent: 'Sanduni Rajapakse', date: '6 hours ago' },
//   ];

//   const topAgents = [
//     { rank: 1, name: 'Kasun Rajapakse', sales: 23, value: '156M', badge: '🥇' },
//     { rank: 2, name: 'Sanduni Fernando', sales: 18, value: '124M', badge: '🥈' },
//     { rank: 3, name: 'Rohan Wickramasinghe', sales: 15, value: '98M', badge: '🥉' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
//         {/* Welcome Section */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
//           <p className="text-gray-500 mt-1">Monitor and manage the entire platform</p>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid md:grid-cols-5 gap-4">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
//             <div className="text-3xl font-bold">1,248</div>
//             <div className="text-blue-100 mt-1">Total Users</div>
//             <div className="text-xs text-blue-200 mt-2">↑ 12% this month</div>
//           </div>
//           <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl shadow-lg text-white">
//             <div className="text-3xl font-bold">452</div>
//             <div className="text-teal-100 mt-1">Active Listings</div>
//             <div className="text-xs text-teal-200 mt-2">↑ 8% this month</div>
//           </div>
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
//             <div className="text-3xl font-bold">89</div>
//             <div className="text-purple-100 mt-1">Active Agents</div>
//             <div className="text-xs text-purple-200 mt-2">↑ 5% this month</div>
//           </div>
//           <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
//             <div className="text-3xl font-bold">23</div>
//             <div className="text-orange-100 mt-1">Pending Approvals</div>
//             <div className="text-xs text-orange-200 mt-2">Requires attention</div>
//           </div>
//           <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
//             <div className="text-3xl font-bold">156</div>
//             <div className="text-green-100 mt-1">Sales This Month</div>
//             <div className="text-xs text-green-200 mt-2">↑ 18% vs last month</div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid md:grid-cols-4 gap-4">
//           <ActionCard 
//             icon={<UserIcon />} 
//             title="Manage Users" 
//             desc="View all users & roles" 
//             color="bg-blue-100" 
            
//           />
//           <ActionCard 
//             icon={<HomeIcon />} 
//             title="Property Approvals" 
//             desc="Review pending listings" 
//             color="bg-orange-100" 
            
//           />
//           <ActionCard 
//             icon={<ChartIcon />} 
//             title="Platform Analytics" 
//             desc="View detailed reports" 
//             color="bg-purple-100" 
//           />
//           <ActionCard 
//             icon={<SettingsIcon />} 
//             title="System Settings" 
//             desc="Configure platform" 
//             color="bg-gray-100" 
//           />
//         </div>

//         {/* Pending Approvals Section */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
//                 {pendingListings.length}
//               </span>
//               Pending Property Approvals
//             </h2>
//             <button className="text-teal-600 text-sm font-medium hover:underline">
//               View All
//             </button>
//           </div>
//           <div className="space-y-3">
//             {pendingListings.map((listing) => (
//               <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-all">
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-gray-900">{listing.property}</h3>
//                   <p className="text-sm text-gray-500">Agent: {listing.agent} • Submitted {listing.date}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all">
//                     Approve
//                   </button>
//                   <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all">
//                     Reject
//                   </button>
//                   <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all">
//                     Review
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Users & Activity Grid */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Recent User Registrations */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent User Registrations</h2>
//             <div className="space-y-3">
//               {recentUsers.map((user) => (
//                 <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
//                       {user.name.charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 text-sm">{user.name}</h3>
//                       <p className="text-xs text-gray-500">{user.role} • {user.date}</p>
//                     </div>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     user.status === 'active' 
//                       ? 'bg-green-100 text-green-700' 
//                       : 'bg-yellow-100 text-yellow-700'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* System Activity */}
//           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">System Activity Log</h2>
//             <div className="space-y-3">
//               <ActivityCard 
//                 activity="New agent registration: Priya Fernando" 
//                 time="1 hour ago" 
//               />
//               <ActivityCard 
//                 activity="Property listing approved: Marine Drive Suite" 
//                 time="2 hours ago" 
//               />
//               <ActivityCard 
//                 activity="User reported: Spam listing flagged" 
//                 time="4 hours ago" 
//               />
//               <ActivityCard 
//                 activity="Payment processed: LKR 2.5M transaction" 
//                 time="6 hours ago" 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Platform Statistics */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <PulseIcon /> Platform Statistics
//           </h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             <StatCard label="Total Revenue" value="LKR 45.2M" />
//             <StatCard label="Active Sessions" value="326" />
//             <StatCard label="Avg. Response Time" value="2.3 mins" />
//             <StatCard label="Customer Satisfaction" value="4.8/5.0" />
//           </div>
//         </div>

//         {/* Top Performing Agents */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agents</h2>
//           <div className="space-y-3">
//             {topAgents.map((agent, index) => (
//               <div 
//                 key={agent.rank} 
//                 className={`flex items-center justify-between p-4 rounded-lg border ${
//                   index === 0 
//                     ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
//                     : 'bg-gray-50 border-gray-200'
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="text-2xl font-bold">{agent.badge}</div>
//                   <div>
//                     <h3 className="font-bold text-gray-900">{agent.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       {agent.sales} sales • LKR {agent.value} total value
//                     </p>
//                   </div>
//                 </div>
//                 <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium">
//                   View Profile
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }