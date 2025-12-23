import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Truck,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  Eye,
} from 'lucide-react';

const colorClasses = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    iconBg: 'from-blue-500 via-blue-600 to-blue-700',
    text: 'from-blue-600 to-blue-800',
    badge: 'from-blue-100 to-blue-200 text-blue-800',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-200/60',
  },
  green: {
    bg: 'from-green-50 to-green-100',
    iconBg: 'from-green-500 via-green-600 to-green-700',
    text: 'from-green-600 to-green-800',
    badge: 'from-green-100 to-green-200 text-green-800',
    border: 'border-green-500/30',
    glow: 'shadow-green-200/60',
  },
  red: {
    bg: 'from-red-50 to-red-100',
    iconBg: 'from-red-500 via-red-600 to-red-700',
    text: 'from-red-600 to-red-800',
    badge: 'from-red-100 to-red-200 text-red-800',
    border: 'border-red-500/30',
    glow: 'shadow-red-200/60',
  },
  orange: {
    bg: 'from-orange-50 to-orange-100',
    iconBg: 'from-orange-500 via-orange-600 to-orange-700',
    text: 'from-orange-600 to-orange-800',
    badge: 'from-orange-100 to-orange-200 text-orange-800',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-200/60',
  },
  purple: {
    bg: 'from-purple-50 to-purple-100',
    iconBg: 'from-purple-500 via-purple-600 to-purple-700',
    text: 'from-purple-600 to-purple-800',
    badge: 'from-purple-100 to-purple-200 text-purple-800',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-200/60',
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-100',
    iconBg: 'from-indigo-500 via-indigo-600 to-indigo-700',
    text: 'from-indigo-600 to-indigo-800',
    badge: 'from-indigo-100 to-indigo-200 text-indigo-800',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-200/60',
  },
};

const SummaryCard = ({ title, value, icon: Icon, color, percent, tag, trend, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cls = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border ${cls.border}
        transition-all duration-300 overflow-hidden
        ${isHovered ? `shadow-xl scale-[1.015] -translate-y-0.5 ${cls.glow}` : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute -inset-px bg-gradient-to-br ${cls.bg} opacity-20 rounded-2xl`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${cls.text}`}>
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+{trend}%</span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl shadow-lg bg-gradient-to-br ${cls.iconBg} 
              transition-all duration-300 transform ${isHovered ? 'rotate-3 scale-110' : 'rotate-0 scale-100'}`}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 min-h-[26px]">
          {percent !== undefined && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm bg-gradient-to-r ${cls.badge}`}
            >
              <CheckCircle className="h-3 w-3" />
              {percent}% Success
            </span>
          )}
          {tag && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-gradient-to-r ${cls.badge} animate-pulse`}
            >
              {tag}
            </span>
          )}
        </div>

        <button
          onClick={onOpen}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2
            bg-gradient-to-r ${cls.iconBg} shadow-md
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

const SummaryCards = ({ summaryData, allGages, openDrawer, handleScheduleForCalibration }) => {
  const defaultSummaryData = summaryData || {
    totalGages: 1250,
    calibratedOnTime: 1128,
    outForCalibration: 45,
    outOfCalibration: 23,
    dueNext15Days: 54,
    scheduledGages: 89,
  };

  const handleOpen = (type) => {
    openDrawer?.(type) || console.log(`Opening ${type} drawer`);
  };

  const cards = [
    {
      title: 'Total Gages',
      value: defaultSummaryData.totalGages,
      icon: BarChart3,
      color: 'blue',
      type: 'total',
      trend: '12',
    },
    {
      title: 'Calibrated On Time',
      value: defaultSummaryData.calibratedOnTime,
      icon: CheckCircle,
      color: 'green',
      percent: defaultSummaryData.totalGages
        ? Math.round((defaultSummaryData.calibratedOnTime / defaultSummaryData.totalGages) * 100)
        : 0,
      type: 'onTime',
      trend: '5',
    },
    {
      title: 'Out for Calibration',
      value: defaultSummaryData.outForCalibration,
      icon: Truck,
      color: 'indigo',
      type: 'outFor',
    },
    {
      title: 'Calibration Due',
      value: defaultSummaryData.outOfCalibration,
      icon: AlertTriangle,
      color: 'red',
      tag: 'Action Required',
      type: 'outOf',
    },
    {
      title: 'Due Next 15 Days',
      value: defaultSummaryData.dueNext15Days,
      icon: Clock,
      color: 'orange',
      type: 'dueNext15',
    },
    {
      title: 'Scheduled Gages',
      value: defaultSummaryData.scheduledGages,
      icon: Calendar,
      color: 'purple',
      tag: 'Ready',
      type: 'scheduled',
      trend: '8',
    },
  ];

  const successRate = defaultSummaryData.totalGages
    ? Math.round((defaultSummaryData.calibratedOnTime / defaultSummaryData.totalGages) * 100)
    : 0;

  return (
    <div className="py-2">
      {/* Stat Overview Banner */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200/70 p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Overall Success Rate', value: `${successRate}%`, color: 'text-blue-600' },
            { label: 'Active Gages', value: defaultSummaryData.totalGages - defaultSummaryData.outOfCalibration, color: 'text-green-600' },
            { label: 'Needs Attention', value: defaultSummaryData.dueNext15Days + defaultSummaryData.outOfCalibration, color: 'text-orange-600' },
            { label: 'In Queue', value: defaultSummaryData.scheduledGages, color: 'text-purple-600' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <p className={`text-xl md:text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            percent={card.percent}
            tag={card.tag}
            trend={card.trend}
            onOpen={() => handleOpen(card.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;