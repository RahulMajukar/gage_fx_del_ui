import React, { useState } from 'react'

const CalibrationHistoryCard = ({ calibrationHistory, loading }) => {
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Status color mapping
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'passed':
        return {
          bg: 'bg-emerald-50',
          border: 'border-l-emerald-500',
          text: 'text-emerald-700',
          badgeBg: 'bg-emerald-100',
          badgeText: 'text-emerald-800',
        };
      case 'failed':
        return {
          bg: 'bg-red-50',
          border: 'border-l-red-500',
          text: 'text-red-700',
          badgeBg: 'bg-red-100',
          badgeText: 'text-red-800',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          border: 'border-l-amber-500',
          text: 'text-amber-700',
          badgeBg: 'bg-amber-100',
          badgeText: 'text-amber-800',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-l-gray-500',
          text: 'text-gray-700',
          badgeBg: 'bg-gray-100',
          badgeText: 'text-gray-800',
        };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-md p-6 mb-6 animate-pulse border border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-5"></div>
        <div className="space-y-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!calibrationHistory || calibrationHistory.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 mb-6 border border-blue-100">
        <h3 className="text-lg font-bold text-indigo-800 mb-2">Calibration History</h3>
        <p className="text-indigo-500 italic">No calibration history available</p>
      </div>
    );
  }

  // Sort history by date (most recent first)
  const sortedHistory = [...calibrationHistory].sort((a, b) => 
    new Date(b.calibrationDate || b.createdAt) - new Date(a.calibrationDate || a.createdAt)
  );

  const visibleItems = showAll ? sortedHistory : sortedHistory.slice(0, 3);
  const hasMore = sortedHistory.length > 3;

  const toggleExpand = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
        <span className="inline-block w-2 h-5 bg-blue-500 rounded mr-3"></span>
        Calibration History
        <span className="ml-auto text-sm font-normal text-gray-500">
          {sortedHistory.length} record{sortedHistory.length !== 1 ? 's' : ''}
        </span>
      </h3>

      <div className="space-y-4">
        {visibleItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const styles = getStatusStyles(item.status);

          return (
            <div
              key={item.id}
              className={`${styles.bg} ${styles.border} border-l-4 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md`}
            >
              {/* Minimal Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-800">
                      {formatDate(item.calibrationDate || item.createdAt)}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badgeBg} ${styles.badgeText}`}
                    >
                      {item.status || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Performed by:</span>{' '}
                    <span className="text-blue-700">{item.performedBy || '—'}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center transition-colors ${isExpanded
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                >
                  {isExpanded ? 'Less Details' : 'More Details'}
                  <svg
                    className={`ml-1.5 w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-300/40 space-y-3 text-sm">
                  {/* Notes Section */}
                  {item.notes && (
                    <div>
                      <div className="text-gray-500 font-medium mb-1">Notes:</div>
                      <p className="text-gray-700 bg-white/50 p-3 rounded-lg border border-gray-200">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Calibration Date */}
                    <div>
                      <div className="text-gray-500 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calibration Date
                      </div>
                      <div className="font-medium text-gray-800">
                        {formatDate(item.calibrationDate)}
                      </div>
                    </div>

                    {/* Next Due Date */}
                    <div>
                      <div className="text-gray-500 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Next Due Date
                      </div>
                      <div className="font-medium text-gray-800">
                        {formatDate(item.nextDueDate) || '—'}
                      </div>
                    </div>

                    {/* Performed By */}
                    <div>
                      <div className="text-gray-500 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Technician
                      </div>
                      <div className="font-medium text-blue-700">
                        {item.performedBy || '—'}
                      </div>
                    </div>

                    {/* Record Created */}
                    <div>
                      <div className="text-gray-500 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Record Created
                      </div>
                      <div className="font-medium text-gray-800">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Additional metadata if available */}
                  {item.certificateNumber && (
                    <div className="text-gray-600">
                      <span className="text-gray-500 font-medium">Certificate #:</span>{' '}
                      {item.certificateNumber}
                    </div>
                  )}

                  {item.standardUsed && (
                    <div className="text-gray-600">
                      <span className="text-gray-500 font-medium">Standard Used:</span>{' '}
                      {item.standardUsed}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            {showAll ? 'Show Less' : `Show ${sortedHistory.length - 3} More Records`}
          </button>
        </div>
      )}
    </div>
  );
};

export default CalibrationHistoryCard