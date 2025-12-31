import { useState, useEffect } from "react";
// Lucide Icons
import {
  CalendarCheck,
  PlayCircle,
  Clock,
  CheckCircle,
  Package,
  RefreshCw,
  Settings,
  FileText
} from "lucide-react";

// Import the Sidebar component
import MachineListSidebar from "./MachineListSidebar"; // adjust path as needed

function LabTechnicianDashboard({ user }) {
  const [scheduledGages, setScheduledGages] = useState([]);
  const [inProgressCalibrations, setInProgressCalibrations] = useState([]);
  const [pendingCalibrations, setPendingCalibrations] = useState([]);
  const [completedCalibrations, setCompletedCalibrations] = useState([]);
  const [availableInstruments, setAvailableInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scheduled");
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar state

  // Mock data remains the same (as fallback)
  const mockScheduledGages = [ /* ... unchanged — keep your existing mock data ... */ ];
  const mockInProgressCalibrations = [ /* ... */ ];
  const mockPendingCalibrations = [ /* ... */ ];
  const mockCompletedCalibrations = [ /* ... */ ];
  const mockAvailableInstruments = [ /* ... */ ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate real API fetch → replace with actual API later
      setTimeout(() => {
        setScheduledGages(mockScheduledGages.filter(g => g.calibrationType === 'inhouse'));
        setInProgressCalibrations(mockInProgressCalibrations.filter(g => g.calibrationType === 'inhouse'));
        setPendingCalibrations(mockPendingCalibrations.filter(g => g.calibrationType === 'inhouse'));
        setCompletedCalibrations(mockCompletedCalibrations.filter(g => g.calibrationType === 'inhouse'));
        setAvailableInstruments(mockAvailableInstruments);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching calibration data:', error);
      setLoading(false);
    }
  };

  // ✅ Stats (unchanged, just refactored slightly)
  const stats = {
    scheduled: scheduledGages.length,
    inProgress: inProgressCalibrations.length,
    pending: pendingCalibrations.length,
    completedToday: completedCalibrations.filter(g =>
      g.completedDate === new Date().toISOString().split('T')[0]
    ).length,
    availableInstruments: availableInstruments.filter(i => i.status === 'available').length
  };

  // ✅ Action handlers remain unchanged
  const handleStartCalibration = (gageId) => { /* ... */ };
  const handleCompleteCalibration = (gageId) => { /* ... */ };
  const handleAssignToMe = (gageId) => { /* ... */ };
  const handleReschedule = (gageId, newDate) => { /* ... */ };
  const refreshData = () => { /* ... */ };

  // ✅ Render tab content — mostly unchanged
  const renderScheduledGages = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <CalendarCheck size={20} className="text-blue-600" />
        Scheduled Gages
      </h3>
      {scheduledGages.length > 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {scheduledGages.map(gage => (
            <div key={gage.id} className="p-4 border-b last:border-b-0">
              <p className="font-semibold">{gage.name}</p>
              <p className="text-sm text-gray-600">{gage.type}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No scheduled gages</p>
      )}
    </div>
  );
  const renderInProgressCalibrations = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <PlayCircle size={20} className="text-yellow-600" />
        In Progress Calibrations
      </h3>
      {inProgressCalibrations.length > 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {inProgressCalibrations.map(calibration => (
            <div key={calibration.id} className="p-4 border-b last:border-b-0">
              <p className="font-semibold">{calibration.name}</p>
              <p className="text-sm text-gray-600">{calibration.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No in-progress calibrations</p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scheduled': return renderScheduledGages();
      case 'in-progress': return renderInProgressCalibrations();
      case 'completed':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              Completed Calibrations
            </h3>
            {/* ... table unchanged ... */}
          </div>
        );
      default: return renderScheduledGages();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Calibration Lab Technician Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome, <span className="font-semibold">{user?.name || 'Technician'}</span>
              <span className="ml-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {user?.role?.replace(/_/g, ' ') || 'Calibration Lab Technician'}
              </span>
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Scheduled"
            value={stats.scheduled}
            subtitle="Gages for calibration"
            color="text-blue-600"
            icon={<CalendarCheck size={24} />}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Active calibrations"
            color="text-yellow-600"
            icon={<PlayCircle size={24} />}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting resources"
            color="text-orange-600"
            icon={<Clock size={24} />}
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            subtitle="Finished today"
            color="text-green-600"
            icon={<CheckCircle size={24} />}
          />
          <div onClick={() => setSidebarOpen(true)} className="cursor-pointer">
            <StatCard
            title="Available Instruments"
            value={stats.availableInstruments}
            subtitle="Ready for use"
            color="text-purple-600"
            icon={<Package size={24} />}
            />
          </div>
        </div>

        {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'scheduled', label: 'Scheduled', count: stats.scheduled, icon: CalendarCheck },
              { id: 'in-progress', label: 'In Progress', count: stats.inProgress, icon: PlayCircle },
              { id: 'pending', label: 'Pending', count: stats.pending, icon: Clock },
              { id: 'completed', label: 'Completed', count: completedCalibrations.length, icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>

      {/* ✅ Available Instruments — CLICKABLE CARD */}
      {/* {renderAvailableInstrumentsCard()} */}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          title="Start New Calibration"
          subtitle="Begin equipment calibration"
          icon={<PlayCircle size={24} />}
          onClick={() => alert('Starting new calibration')}
        />
        <ActionCard
          title="Generate Report"
          subtitle="Create calibration certificates"
          icon={<FileText size={24} />}
          onClick={() => alert('Generating report')}
        />
        <ActionCard
          title="View Schedule"
          subtitle="Check calibration timeline"
          icon={<CalendarCheck size={24} />}
          onClick={() => alert('Viewing schedule')}
        />
        <ActionCard
          title="Manage Instruments"
          subtitle="Calibration equipment"
          icon={<Settings size={24} />}
          onClick={() => alert('Managing instruments')}
        />
      </div>

      {/* ✅ Sidebar */}
      {sidebarOpen && (
        <MachineListSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// ✅ Helper Components
const StatCard = ({ title, value, subtitle, color, icon }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
    <div className="flex items-start">
      <div className={`${color} mr-3`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ActionCard = ({ title, subtitle, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-4 text-left hover:opacity-90 transition-opacity shadow"
  >
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <div className="text-lg font-semibold">{title}</div>
    </div>
    <div className="text-sm opacity-90">{subtitle}</div>
  </button>
);

export default LabTechnicianDashboard;