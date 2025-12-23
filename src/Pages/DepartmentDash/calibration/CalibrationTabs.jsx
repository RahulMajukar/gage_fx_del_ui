// // src/components/dashboard/CalibrationTabs.jsx
// import React, { useState } from 'react';
// import { 
//   Calendar, 
//   Clock, 
//   AlertCircle, 
//   Truck, 
//   ChevronRight,
//   MapPin,
//   User,
//   Package,
//   TrendingUp,
//   CheckCircle2,
//   XCircle,
//   CalendarCheck,
//   Building2
// } from 'lucide-react';

// const CalibrationTabs = ({ 
//   activeTab, 
//   setActiveTab, 
//   allGauges, 
//   scheduledGages = [], // Add this prop with default value
//   handleScheduleForCalibration, 
//   getPriorityColor, 
//   getStatusColor 
// }) => {
//   const [hoveredItem, setHoveredItem] = useState(null);

//   // Update tabs count
//   const tabs = [
//     {
//       id: 'schedule',
//       label: 'Scheduled',
//       icon: Calendar,
//       color: 'blue',
//       // count: scheduledGages.length // Use scheduled gages count
//        count: allGauges.filter(g => (g.status || '').toString().toLowerCase() === 'scheduled').length
//     },
//     {
//       id: 'upcoming',
//       label: 'Upcoming',
//       icon: CalendarCheck,
//       color: 'green',
//       count: allGauges.filter(g => g.source === 'upcoming').length
//     },
//     {
//       id: 'outFor',
//       label: 'Out for Calibration',
//       icon: Truck,
//       color: 'indigo',
//       count: allGauges.filter(g => g.source === 'outFor').length
//     },
//     {
//       id: 'overdue',
//       label: 'Overdue',
//       icon: AlertCircle,
//       color: 'red',
//       count: allGauges.filter(g => g.source === 'outOf').length
//     }
//   ];

//   const getTabColor = (tabId) => {
//     const colors = {
//       schedule: 'border-blue-600 text-blue-600 bg-blue-50',
//       upcoming: 'border-green-600 text-green-600 bg-green-50',
//       outFor: 'border-indigo-600 text-indigo-600 bg-indigo-50',
//       overdue: 'border-red-600 text-red-600 bg-red-50'
//     };
//     return colors[tabId] || 'border-gray-300 text-gray-600';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     return timeString;
//   };

//   const calculateDaysOverdue = (dueDate) => {
//     if (!dueDate) return 0;
//     const days = Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
//     return Math.max(0, days);
//   };

//   const calculateDaysUntil = (dueDate) => {
//     if (!dueDate) return null;
//     const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
//     return days;
//   };

//   // Update ScheduledGaugeCard component
//   const ScheduledGaugeCard = ({ item }) => {
//     const isHovered = hoveredItem === item.id;
//     const daysUntilSchedule = calculateDaysUntil(item.scheduleInfo?.scheduledDate);

//     return (
//       <div 
//         className={`group relative bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
//           isHovered 
//             ? 'border-blue-400 shadow-xl scale-[1.02]' 
//             : 'border-blue-200 shadow-sm hover:shadow-lg'
//         }`}
//         onMouseEnter={() => setHoveredItem(item.id)}
//         onMouseLeave={() => setHoveredItem(null)}
//       >
//         {/* Scheduled stripe */}
//         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

//         {/* Hover glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//         <div className="relative p-5">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <Package className="h-5 w-5 text-blue-500" />
//                 <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
//                   {item.name}
//                 </h4>
//               </div>
//               {item.manufacturer && (
//                 <p className="text-sm text-gray-500 ml-7">by {item.manufacturer}</p>
//               )}
//             </div>

//             {/* Schedule Status Badge */}
//             <div className="flex flex-col items-end gap-2">
//               <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500 text-white shadow-md">
//                 SCHEDULED
//               </span>
//               {daysUntilSchedule !== null && daysUntilSchedule >= 0 && (
//                 <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
//                   in {daysUntilSchedule} {daysUntilSchedule === 1 ? 'day' : 'days'}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Schedule Info Grid */}
//           <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
//             <h5 className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
//               <CalendarCheck className="h-4 w-4" />
//               SCHEDULE DETAILS
//             </h5>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs text-blue-700 font-medium">Date & Time</p>
//                 <p className="text-sm font-bold text-blue-900">
//                   {formatDate(item.scheduleInfo?.scheduledDate)}
//                 </p>
//                 <p className="text-xs text-blue-600">
//                   at {formatTime(item.scheduleInfo?.scheduledTime)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-blue-700 font-medium">Assigned To</p>
//                 <p className="text-sm font-bold text-blue-900">
//                   {item.scheduleInfo?.assignedTo || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-blue-700 font-medium">Laboratory</p>
//                 <p className="text-sm font-bold text-blue-900 flex items-center gap-1">
//                   <Building2 className="h-3 w-3" />
//                   {item.scheduleInfo?.laboratory || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-blue-700 font-medium">Duration</p>
//                 <p className="text-sm font-bold text-blue-900">
//                   {item.scheduleInfo?.estimatedDuration || 'N/A'} hours
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Gauge Info Grid */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="flex items-start gap-2">
//               <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Last Calibrated</p>
//                 <p className="text-sm font-semibold text-gray-900">{formatDate(item.lastCalibrated)}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-2">
//               <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Due Date</p>
//                 <p className="text-sm font-semibold text-gray-900">{formatDate(item.dueDate)}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-2">
//               <User className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Responsible</p>
//                 <p className="text-sm font-semibold text-gray-900">{item.responsible}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-2">
//               <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Location</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {item.location || item.department || 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Priority Badge */}
//           <div className="flex items-center gap-2">
//             <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
//               item.priority === 'high' ? 'bg-red-100 text-red-700' :
//               item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//               'bg-green-100 text-green-700'
//             }`}>
//               {item.priority?.toUpperCase()} PRIORITY
//             </span>
//             {item.scheduleInfo?.scheduleStatus && (
//               <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
//                 {item.scheduleInfo.scheduleStatus}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Decorative corner */}
//         <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-100 to-transparent opacity-30 rounded-tl-full"></div>
//       </div>
//     );
//   };

//   const GaugeCard = ({ item, showScheduleButton = true, isOverdue = false }) => {
//     const isHovered = hoveredItem === item.id;
//     const daysUntil = calculateDaysUntil(item.dueDate);
//     const daysOverdue = isOverdue ? calculateDaysOverdue(item.dueDate) : 0;

//     return (
//       <div 
//         className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
//           isHovered 
//             ? 'border-blue-400 shadow-xl scale-[1.02]' 
//             : 'border-gray-200 shadow-sm hover:shadow-lg'
//         }`}
//         onMouseEnter={() => setHoveredItem(item.id)}
//         onMouseLeave={() => setHoveredItem(null)}
//       >
//         {/* Priority stripe */}
//         <div className={`absolute top-0 left-0 w-1 h-full ${
//           item.priority === 'high' ? 'bg-red-500' : 
//           item.priority === 'medium' ? 'bg-yellow-500' : 
//           'bg-green-500'
//         }`}></div>

//         {/* Hover glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//         <div className="relative p-5">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <Package className="h-5 w-5 text-gray-400" />
//                 <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
//                   {item.name}
//                 </h4>
//               </div>
//               {item.manufacturer && (
//                 <p className="text-sm text-gray-500 ml-7">by {item.manufacturer}</p>
//               )}
//             </div>

//             {/* Priority Badge */}
//             <div className="flex flex-col items-end gap-2">
//               <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
//                 item.priority === 'high' ? 'bg-red-100 text-red-700' :
//                 item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                 'bg-green-100 text-green-700'
//               }`}>
//                 {item.priority?.toUpperCase()}
//               </span>
              
//               {isOverdue && (
//                 <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-md animate-pulse">
//                   {daysOverdue} DAYS OVERDUE
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Info Grid */}
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             {/* Last Calibrated */}
//             <div className="flex items-start gap-2">
//               <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Last Calibrated</p>
//                 <p className="text-sm font-semibold text-gray-900">{formatDate(item.lastCalibrated)}</p>
//               </div>
//             </div>

//             {/* Due Date */}
//             <div className="flex items-start gap-2">
//               <Clock className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
//                 isOverdue ? 'text-red-500' : daysUntil && daysUntil < 15 ? 'text-orange-500' : 'text-blue-500'
//               }`} />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Due Date</p>
//                 <p className={`text-sm font-semibold ${
//                   isOverdue ? 'text-red-600' : 'text-gray-900'
//                 }`}>
//                   {formatDate(item.dueDate)}
//                 </p>
//                 {!isOverdue && daysUntil !== null && (
//                   <p className={`text-xs ${daysUntil < 15 ? 'text-orange-600' : 'text-gray-500'}`}>
//                     in {daysUntil} days
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Responsible */}
//             <div className="flex items-start gap-2">
//               <User className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Responsible</p>
//                 <p className="text-sm font-semibold text-gray-900">{item.responsible}</p>
//               </div>
//             </div>

//             {/* Location/Department */}
//             <div className="flex items-start gap-2">
//               <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Location</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {item.location || item.department || 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Status Badge */}
//           {item.status && (
//             <div className="mb-4">
//               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
//                 getStatusColor ? getStatusColor(item.status) : 'bg-gray-100 text-gray-700'
//               }`}>
//                 <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//                 {item.status}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Decorative corner */}
//         <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-gray-100 to-transparent opacity-30 rounded-tl-full"></div>
//       </div>
//     );
//   };

//   const renderTabContent = () => {
//     let items = [];
//     let title = '';
//     let emptyMessage = '';
//     let isOverdue = false;
//     let isScheduled = false;
//     console.log('Scheduled Gages:', allGauges.filter(g => g.status === 'scheduled'));
//     if (activeTab === 'schedule') {
//       items = allGauges.filter(g => g.status == 'scheduled');
//       title = 'Scheduled Calibrations';
//       emptyMessage = 'No calibrations scheduled yet';
//       isScheduled = true;
//     } else if (activeTab === 'upcoming') {
//       items = allGauges.filter(g => g.source === 'upcoming').slice(0, 5);
//       title = 'Upcoming Calibrations';
//       emptyMessage = 'No upcoming calibrations';
//     } else if (activeTab === 'outFor') {
//       items = allGauges.filter(g => g.source === 'outFor');
//       title = 'Out for Calibration';
//       emptyMessage = 'No gauges currently out for calibration';
//     } else if (activeTab === 'overdue') {
//       items = allGauges.filter(g => g.source === 'outOf');
//       title = 'Overdue Calibrations';
//       emptyMessage = 'No overdue calibrations';
//       isOverdue = true;
//     }

//     return (
//       <div className="space-y-4">
//         {/* Header with stats */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//             <p className="text-sm text-gray-500 mt-1">
//               Showing {items.length} {items.length === 1 ? 'item' : 'items'}
//             </p>
//           </div>
          
//           {items.length > 0 && (
//             <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
//               <TrendingUp className="h-4 w-4 text-blue-600" />
//               <span className="text-sm font-semibold text-blue-700">
//                 {items.length} Active
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         {items.length > 0 ? (
//           <div className="grid grid-cols-1 gap-4">
//             {items.map((item) => (
//               isScheduled ? (
//                 <ScheduledGaugeCard key={item.id} item={item} />
//               ) : (
//                 <GaugeCard 
//                   key={item.id} 
//                   item={item} 
//                   isOverdue={isOverdue}
//                 />
//               )
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
//             <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 font-medium">{emptyMessage}</p>
//             <p className="text-sm text-gray-400 mt-2">
//               {isScheduled ? 'Schedule a calibration to get started' : 'Check back later for updates'}
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
//       {/* Tabs Header */}
//       <div className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200 px-6 py-4">
//         <div className="flex gap-3 overflow-x-auto">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
            
//             return (
//               <button
//                 key={tab.id}
//                 className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
//                   isActive
//                     ? `${getTabColor(tab.id)} shadow-md transform scale-105`
//                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                 }`}
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span>{tab.label}</span>
                
//                 {/* Count badge */}
//                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
//                   isActive 
//                     ? 'bg-white/80 text-current' 
//                     : 'bg-gray-200 text-gray-700'
//                 }`}>
//                   {tab.count}
//                 </span>

//                 {/* Active indicator */}
//                 {isActive && (
//                   <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-current rounded-t-full"></span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="p-6">
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default CalibrationTabs;
// src/components/dashboard/CalibrationTabs.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Truck, 
  ChevronRight,
  MapPin,
  User,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Building2,
  MoreVertical,
  Edit2,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Bell,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Battery,
  Thermometer,
  Gauge,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const CalibrationTabs = ({ 
  activeTab, 
  setActiveTab, 
  allGauges, 
  scheduledGages = [],
  handleScheduleForCalibration, 
  getPriorityColor, 
  getStatusColor 
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeGaugeType, setActiveGaugeType] = useState('all');
  const [notifications, setNotifications] = useState({
    schedule: 2,
    upcoming: 3,
    outFor: 1,
    overdue: 5
  });

  // Animation effects
  useEffect(() => {
    if (selectedItem) {
      const timer = setTimeout(() => setSelectedItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  const simulateAction = (action, item) => {
    setSelectedItem(item.id);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Add success notification
      if (action === 'schedule') {
        // Handle scheduling
      }
    }, 800);
  };

  // Update tabs with notifications
  const tabs = [
    {
      id: 'schedule',
      label: 'Scheduled',
      icon: Calendar,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      count: allGauges.filter(g => g.status === 'scheduled').length,
      // notifications: notifications.schedule
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: CalendarCheck,
      color: 'green',
      gradient: 'from-emerald-500 to-green-500',
      count: allGauges.filter(g => g.source === 'upcoming').length,
      // notifications: notifications.upcoming
    },
    {
      id: 'outFor',
      label: 'In Progress',
      icon: Truck,
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-500',
      count: allGauges.filter(g => g.source === 'outFor').length,
      // notifications: notifications.outFor
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      color: 'red',
      gradient: 'from-rose-500 to-red-500',
      count: allGauges.filter(g => g.source === 'outOf').length,
      // notifications: notifications.overdue
    }
  ];

  const getGaugeIcon = (type) => {
    const icons = {
      pressure: <Gauge className="h-5 w-5" />,
      temperature: <Thermometer className="h-5 w-5" />,
      electrical: <Battery className="h-5 w-5" />,
      flow: <Zap className="h-5 w-5" />,
      default: <Package className="h-5 w-5" />
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const getGaugeColor = (type) => {
    const colors = {
      pressure: 'bg-purple-100 text-purple-600',
      temperature: 'bg-orange-100 text-orange-600',
      electrical: 'bg-cyan-100 text-cyan-600',
      flow: 'bg-amber-100 text-amber-600',
      default: 'bg-blue-100 text-blue-600'
    };
    return colors[type?.toLowerCase()] || colors.default;
  };

  const getTabColor = (tabId) => {
    const colors = {
      schedule: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-700',
      upcoming: 'bg-gradient-to-r from-emerald-50 to-green-50 border-green-300 text-green-700',
      outFor: 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-700',
      overdue: 'bg-gradient-to-r from-rose-50 to-red-50 border-red-300 text-red-700'
    };
    return colors[tabId] || 'border-gray-300 text-gray-600';
  };

  const getTabGradient = (tabId) => {
    const gradients = {
      schedule: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      upcoming: 'bg-gradient-to-r from-emerald-500 to-green-500',
      outFor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      overdue: 'bg-gradient-to-r from-rose-500 to-red-500'
    };
    return gradients[tabId] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDaysUntil = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredItems = (items) => {
    return items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
      const matchesType = activeGaugeType === 'all' || item.type === activeGaugeType;
      
      return matchesSearch && matchesPriority && matchesType;
    });
  };

  const ScheduledGaugeCard = ({ item }) => {
    const isHovered = hoveredItem === item.id;
    const isSelected = selectedItem === item.id;
    const daysUntilSchedule = calculateDaysUntil(item.scheduleInfo?.scheduledDate);

    return (
      <div 
        className={`group relative bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
          isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' :
          isHovered 
            ? 'border-blue-300 shadow-2xl scale-[1.02]' 
            : 'border-blue-100 shadow-lg hover:shadow-2xl'
        }`}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => simulateAction('view', item)}
      >
        {/* Animated background stripe */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600 animate-gradient-y"></div>

        {/* Floating elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>

        <div className="relative p-6">
          {/* Header with action menu */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${getGaugeColor(item.type)} shadow-sm`}>
                  {getGaugeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-xl truncate group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h4>
                    {item.certified && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {item.modelNumber && `Model: ${item.modelNumber}`} 
                    {item.serialNumber && ` • S/N: ${item.serialNumber}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Schedule Status */}
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform group-hover:scale-105 transition-transform">
                  SCHEDULED
                </span>
                {daysUntilSchedule !== null && daysUntilSchedule >= 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">
                      {daysUntilSchedule === 0 ? 'Today' : 
                       daysUntilSchedule === 1 ? 'Tomorrow' : 
                       `in ${daysUntilSchedule} days`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="relative group/menu">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                  <button className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3">
                    <Edit2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Reschedule</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 flex items-center gap-3">
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar for schedule */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Schedule Progress</span>
              <span className="font-semibold">65%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Schedule Info Grid */}
          <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-5 mb-6 border border-blue-200 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                SCHEDULE DETAILS
              </h5>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Confirmed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">Date</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {formatDate(item.scheduleInfo?.scheduledDate)}
                </p>
                <p className="text-sm text-blue-600">
                  {item.scheduleInfo?.scheduledTime || '09:00 AM'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-medium">Assigned To</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {item.scheduleInfo?.assignedTo || 'John Smith'}
                </p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Certified Technician
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-medium">Laboratory</span>
                </div>
                <p className="text-lg font-bold text-blue-900 flex items-center gap-1">
                  {item.scheduleInfo?.laboratory || 'Main Lab'}
                </p>
                <p className="text-xs text-blue-600">
                  Room 205 • Temperature Controlled
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Duration</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {item.scheduleInfo?.estimatedDuration || 4} hours
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-xs text-blue-600">40% efficiency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-1">Calibration History</p>
              <p className="text-lg font-bold text-gray-900">8 times</p>
              <p className="text-xs text-green-600">↑ 2 from last year</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-1">Success Rate</p>
              <p className="text-lg font-bold text-gray-900">98.5%</p>
              <p className="text-xs text-green-600">Excellent</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-1">Avg. Duration</p>
              <p className="text-lg font-bold text-gray-900">3.2 hrs</p>
              <p className="text-xs text-blue-600">Within standard</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-1">Compliance</p>
              <p className="text-lg font-bold text-gray-900">100%</p>
              <p className="text-xs text-green-600">Fully compliant</p>
            </div>
          </div> */}

          {/* Action Buttons */}
          {/* <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Technician
            </button>
            <button className="flex-1 border-2 border-blue-300 text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Status
            </button>
            <button className="px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Docs
            </button>
          </div> */}
        </div>

        {/* Live status indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
        </div>
      </div>
    );
  };

  const GaugeCard = ({ item, showScheduleButton = true, isOverdue = false }) => {
    const isHovered = hoveredItem === item.id;
    const isSelected = selectedItem === item.id;
    const daysUntil = calculateDaysUntil(item.dueDate);
    const urgency = daysUntil <= 7 ? 'high' : daysUntil <= 30 ? 'medium' : 'low';

    return (
      <div 
        className={`group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
          isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' :
          isHovered 
            ? 'border-blue-300 shadow-2xl scale-[1.02]' 
            : 'border-gray-200 shadow-lg hover:shadow-2xl'
        }`}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => simulateAction('view', item)}
      >
        {/* Animated priority stripe */}
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${
          isOverdue ? 'from-red-500 via-rose-400 to-red-600' :
          item.priority === 'high' ? 'from-red-500 via-orange-400 to-red-600' : 
          item.priority === 'medium' ? 'from-yellow-500 via-amber-400 to-yellow-600' : 
          'from-green-500 via-emerald-400 to-green-600'
        } animate-gradient-y`}></div>

        {/* Floating elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${getGaugeColor(item.type)} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {getGaugeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-xl truncate group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h4>
                    {item.critical && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {item.manufacturer && `by ${item.manufacturer}`}
                    {item.modelNumber && ` • ${item.modelNumber}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Priority Badge with animation */}
              <div className="relative">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-transform ${
                  isOverdue ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse' :
                  item.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' :
                  item.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900' :
                  'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                }`}>
                  {isOverdue ? 'OVERDUE' : item.priority?.toUpperCase()}
                </span>
                
                {isOverdue && (
                  <div className="absolute -top-1 -right-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                      <Bell className="h-3 w-3 text-white relative" />
                    </div>
                  </div>
                )}
              </div>

              {/* Days counter */}
              {daysUntil !== null && (
                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                  isOverdue ? 'bg-red-50 text-red-700 border border-red-200' :
                  urgency === 'high' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                  urgency === 'medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{isOverdue ? `${Math.abs(daysUntil)} days ago` : `${daysUntil} days`}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Last Calibrated */}
            <div className="group/info relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Last Calibrated</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(item.lastCalibrated)}</p>
                </div>
              </div>
              <div className="absolute right-3 top-3 opacity-0 group-hover/info:opacity-100 transition-opacity">
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Due Date */}
            <div className="group/info relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isOverdue ? 'bg-red-100' :
                  urgency === 'high' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <Clock className={`h-4 w-4 ${
                    isOverdue ? 'text-red-600' :
                    urgency === 'high' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Due Date</p>
                  <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(item.dueDate)}
                  </p>
                  {!isOverdue && (
                    <p className={`text-xs ${urgency === 'high' ? 'text-orange-600' : 'text-gray-500'}`}>
                      {daysUntil} days remaining
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Responsible Person */}
            <div className="group/info relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Responsible</p>
                  <p className="text-sm font-bold text-gray-900">{item.responsible}</p>
                  <p className="text-xs text-indigo-600">Lead Technician</p>
                </div>
              </div>
              <div className="absolute right-3 top-3 opacity-0 group-hover/info:opacity-100 transition-opacity">
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Location */}
            <div className="group/info relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {item.location || item.department || 'N/A'}
                  </p>
                  <p className="text-xs text-purple-600">Building A • Floor 3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {item.status && (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                  getStatusColor ? getStatusColor(item.status) : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {item.status}
                </span>
              )}
              
              {item.certification && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium border border-yellow-200">
                  <Shield className="h-3 w-3" />
                  ISO 9001 Certified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showScheduleButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    simulateAction('schedule', item);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group/btn"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                      Schedule
                    </>
                  )}
                </button>
              )}
              
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Eye className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-300">
            <div className="w-6 h-6 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="85, 100"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-700">
                85%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    let items = [];
    let title = '';
    let emptyMessage = '';
    let isOverdue = false;
    let isScheduled = false;
    let icon = null;

    switch (activeTab) {
      case 'schedule':
        items = allGauges.filter(g => g.status === 'scheduled');
        title = 'Scheduled Calibrations';
        emptyMessage = 'No calibrations scheduled yet';
        icon = <Calendar className="h-5 w-5" />;
        isScheduled = true;
        break;
      case 'upcoming':
        items = allGauges.filter(g => g.source === 'upcoming');
        title = 'Upcoming Calibrations';
        emptyMessage = 'No upcoming calibrations';
        icon = <CalendarCheck className="h-5 w-5" />;
        break;
      case 'outFor':
        items = allGauges.filter(g => g.source === 'outFor');
        title = 'In Progress Calibrations';
        emptyMessage = 'No gauges currently in progress';
        icon = <Truck className="h-5 w-5" />;
        break;
      case 'overdue':
        items = allGauges.filter(g => g.source === 'outOf');
        title = 'Overdue Calibrations';
        emptyMessage = 'No overdue calibrations';
        icon = <AlertCircle className="h-5 w-5" />;
        isOverdue = true;
        break;
    }

    const filtered = filteredItems(items);

    return (
      <div className="space-y-6">
        {/* Header with search and filters */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                  {icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {filtered.length} of {items.length} items showing
                    {filterPriority !== 'all' && ` • Filtered by ${filterPriority}`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gauges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all w-full"
                />
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 bg-white flex items-center gap-2 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Export Button */}
              <button className="px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-400 bg-white flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                <span className="font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-5 bg-white rounded-xl border border-gray-200 shadow-lg animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Priority Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'low', 'medium', 'high'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setFilterPriority(priority)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          filterPriority === priority
                            ? priority === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                              priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                              priority === 'low' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                              'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gauge Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gauge Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pressure', 'temperature', 'electrical', 'flow'].map(type => (
                      <button
                        key={type}
                        onClick={() => setActiveGaugeType(type)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                          activeGaugeType === type
                            ? type === 'pressure' ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' :
                              type === 'temperature' ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                              type === 'electrical' ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300' :
                              type === 'flow' ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' :
                              'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getGaugeIcon(type)}
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Actions
                  </label>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors flex items-center gap-2">
                      <RefreshCw className="h-3 w-3" />
                      Reset Filters
                    </button>
                    <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 transition-colors flex items-center gap-2">
                      <BarChart3 className="h-3 w-3" />
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{filtered.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">On Schedule</p>
                <p className="text-2xl font-bold text-green-900">
                  {filtered.filter(item => !isOverdue && calculateDaysUntil(item.dueDate) > 7).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-2xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium mb-1">Urgent</p>
                <p className="text-2xl font-bold text-orange-900">
                  {filtered.filter(item => 
                    !isOverdue && 
                    calculateDaysUntil(item.dueDate) <= 7 && 
                    calculateDaysUntil(item.dueDate) > 0
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium mb-1">
                  {isOverdue ? 'Total Overdue' : 'Risk Level'}
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {isOverdue ? filtered.length : 'High'}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 animate-fadeIn">
            {filtered.map((item) => (
              isScheduled ? (
                <ScheduledGaugeCard key={item.id} item={item} />
              ) : (
                <GaugeCard 
                  key={item.id} 
                  item={item} 
                  showScheduleButton={!isOverdue}
                  isOverdue={isOverdue}
                />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-20"></div>
              <XCircle className="h-20 w-20 text-gray-300 relative" />
            </div>
            <p className="text-gray-500 font-medium text-lg mb-2">{emptyMessage}</p>
            <p className="text-sm text-gray-400 mb-6">
              {isScheduled ? 'Schedule a calibration to get started' : 'Check back later for updates'}
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {isScheduled ? 'Schedule First Calibration' : 'Refresh Data'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
      {/* Tabs Header with gradient */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b-2 border-gray-200/50 px-6 py-5">

        {/* Enhanced Tabs */}
        <div className="mt-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap group ${
                    isActive
                      ? `${getTabColor(tab.id)} shadow-xl transform scale-105`
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-lg'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {/* Background glow for active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-current/10 to-transparent rounded-2xl"></div>
                  )}

                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {tab.notifications > 0 && !isActive && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                        {tab.notifications}
                      </span>
                    )}
                  </div>
                  
                  <span className="relative">{tab.label}</span>
                  
                  {/* Count badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-white/90 text-current shadow-sm' 
                      : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                  }`}>
                    {tab.count}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5">
                      <div className="h-1 bg-gradient-to-r from-current to-current/50 rounded-t-full"></div>
                    </div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current/20 transition-colors"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-spin" />
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

// Add custom animations to your global CSS
const customStyles = `
  @keyframes gradient-y {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-gradient-y {
    background-size: 200% 200%;
    animation: gradient-y 3s ease infinite;
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add this to your global CSS file
export default CalibrationTabs;