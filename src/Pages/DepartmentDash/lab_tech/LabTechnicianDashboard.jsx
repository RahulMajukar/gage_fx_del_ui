// src/Pages/DepartmentDash/LabTechnicianDashboard.jsx
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
    FileText,
    AlertTriangle,
    Calendar,
    MapPin,
    User,
    Filter,
    Download
} from "lucide-react";

// Import the Sidebar component
import MachineListSidebar from "./MachineListSidebar";

function LabTechnicianDashboard({ user }) {
    const [scheduledGages, setScheduledGages] = useState([]);
    const [inProgressCalibrations, setInProgressCalibrations] = useState([]);
    const [pendingCalibrations, setPendingCalibrations] = useState([]);
    const [completedCalibrations, setCompletedCalibrations] = useState([]);
    const [availableInstruments, setAvailableInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("scheduled");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock data for scheduled gages
    const mockScheduledGages = [
        {
            id: 1,
            gageId: 'GAGE-001',
            name: 'Digital Micrometer',
            type: 'Length',
            instrumentRequired: 'Master Calibrator',
            instrumentId: 'INST-001',
            calibrationType: 'inhouse',
            scheduledDate: '2024-01-25',
            dueDate: '2024-02-25',
            priority: 'High',
            status: 'scheduled',
            location: 'Store Room A',
            requestedBy: 'Production Dept',
            requestDate: '2024-01-20',
            technician: null
        },
        {
            id: 2,
            gageId: 'GAGE-002',
            name: 'Pressure Gauge',
            type: 'Pressure',
            instrumentRequired: 'Pressure Standard',
            instrumentId: 'INST-002',
            calibrationType: 'inhouse',
            scheduledDate: '2024-01-26',
            dueDate: '2024-02-26',
            priority: 'Medium',
            status: 'scheduled',
            location: 'Lab Storage',
            requestedBy: 'Quality Dept',
            requestDate: '2024-01-21',
            technician: null
        },
        {
            id: 3,
            gageId: 'GAGE-003',
            name: 'Temperature Sensor',
            type: 'Temperature',
            instrumentRequired: 'Temperature Bath',
            instrumentId: 'INST-003',
            calibrationType: 'inhouse',
            scheduledDate: '2024-01-27',
            dueDate: '2024-02-27',
            priority: 'Low',
            status: 'scheduled',
            location: 'Calibration Lab',
            requestedBy: 'Maintenance',
            requestDate: '2024-01-22',
            technician: null
        },
    ];

    // Mock data for in-progress calibrations
    const mockInProgressCalibrations = [
        {
            id: 6,
            gageId: 'GAGE-006',
            name: 'Digital Caliper',
            type: 'Length',
            instrumentUsed: 'Master Calibrator',
            instrumentId: 'INST-001',
            calibrationType: 'inhouse',
            startedDate: '2024-01-24',
            technician: user?.name || 'You',
            progress: '75%',
            estimatedCompletion: '2024-01-25 14:00',
            status: 'in-progress'
        },
        {
            id: 7,
            gageId: 'GAGE-007',
            name: 'Pressure Transmitter',
            type: 'Pressure',
            instrumentUsed: 'Pressure Standard',
            instrumentId: 'INST-002',
            calibrationType: 'inhouse',
            startedDate: '2024-01-24',
            technician: 'John Doe',
            progress: '50%',
            estimatedCompletion: '2024-01-25 16:00',
            status: 'in-progress'
        }
    ];

    // Mock data for pending calibrations
    const mockPendingCalibrations = [
        {
            id: 8,
            gageId: 'GAGE-008',
            name: 'Thermocouple',
            type: 'Temperature',
            instrumentRequired: 'Temperature Bath',
            instrumentId: 'INST-003',
            calibrationType: 'inhouse',
            scheduledDate: '2024-01-30',
            reason: 'Awaiting instrument availability',
            status: 'pending'
        },
        {
            id: 9,
            gageId: 'GAGE-009',
            name: 'Torque Wrench',
            type: 'Torque',
            instrumentRequired: 'Torque Tester',
            instrumentId: 'INST-004',
            calibrationType: 'inhouse',
            scheduledDate: '2024-01-31',
            reason: 'Equipment under maintenance',
            status: 'pending'
        }
    ];

    // Mock data for completed calibrations
    const mockCompletedCalibrations = [
        {
            id: 10,
            gageId: 'GAGE-010',
            name: 'pH Meter',
            type: 'pH',
            instrumentUsed: 'pH Calibrator',
            calibrationType: 'inhouse',
            completedDate: new Date().toISOString().split('T')[0],
            technician: user?.name || 'You',
            result: 'Pass',
            certificateNo: 'CERT-001-2024',
            status: 'completed'
        },
        {
            id: 11,
            gageId: 'GAGE-011',
            name: 'Flow Meter',
            type: 'Flow',
            instrumentUsed: 'Flow Calibrator',
            calibrationType: 'inhouse',
            completedDate: new Date().toISOString().split('T')[0],
            technician: 'Jane Smith',
            result: 'Pass',
            certificateNo: 'CERT-002-2024',
            status: 'completed'
        },
        {
            id: 12,
            gageId: 'GAGE-012',
            name: 'Multimeter',
            type: 'Electrical',
            instrumentUsed: 'Multifunction Calibrator',
            calibrationType: 'inhouse',
            completedDate: '2024-01-22',
            technician: user?.name || 'You',
            result: 'Fail',
            certificateNo: 'CERT-003-2024',
            status: 'completed'
        }
    ];

    // Mock data for available instruments
    const mockAvailableInstruments = [
        {
            id: 'INST-001',
            name: 'Master Calibrator',
            type: 'Length',
            status: 'available',
            lastCalibration: '2024-01-10',
            nextCalibrationDue: '2024-07-10',
            location: 'Lab A',
            currentUser: null
        },
        {
            id: 'INST-002',
            name: 'Pressure Standard',
            type: 'Pressure',
            status: 'in-use',
            lastCalibration: '2024-01-05',
            nextCalibrationDue: '2024-07-05',
            location: 'Lab B',
            currentUser: 'John Doe'
        },
        {
            id: 'INST-003',
            name: 'Temperature Bath',
            type: 'Temperature',
            status: 'available',
            lastCalibration: '2024-01-12',
            nextCalibrationDue: '2024-07-12',
            location: 'Lab C',
            currentUser: null
        },
        {
            id: 'INST-004',
            name: 'Torque Tester',
            type: 'Torque',
            status: 'maintenance',
            lastCalibration: '2023-12-20',
            nextCalibrationDue: '2024-06-20',
            location: 'Lab A',
            currentUser: null
        },
        {
            id: 'INST-005',
            name: 'Flow Calibrator',
            type: 'Flow',
            status: 'available',
            lastCalibration: '2024-01-08',
            nextCalibrationDue: '2024-07-08',
            location: 'Lab B',
            currentUser: null
        }
    ];

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

    // Stats calculation
    const stats = {
        scheduled: scheduledGages.length,
        inProgress: inProgressCalibrations.length,
        pending: pendingCalibrations.length,
        completedToday: completedCalibrations.filter(g =>
            g.completedDate === new Date().toISOString().split('T')[0]
        ).length,
        availableInstruments: availableInstruments.filter(i => i.status === 'available').length
    };

    // Action handlers
    const handleStartCalibration = (gageId) => {
        const gage = scheduledGages.find(g => g.gageId === gageId);
        if (gage) {
            setScheduledGages(prev => prev.filter(g => g.gageId !== gageId));
            setInProgressCalibrations(prev => [...prev, {
                ...gage,
                status: 'in-progress',
                startedDate: new Date().toISOString().split('T')[0],
                technician: user?.name || 'You',
                progress: '0%'
            }]);
            alert(`Started calibration for ${gageId}`);
        }
    };

    const handleCompleteCalibration = (gageId) => {
        const gage = inProgressCalibrations.find(g => g.gageId === gageId);
        if (gage) {
            setInProgressCalibrations(prev => prev.filter(g => g.gageId !== gageId));
            setCompletedCalibrations(prev => [...prev, {
                ...gage,
                status: 'completed',
                completedDate: new Date().toISOString().split('T')[0],
                result: Math.random() > 0.2 ? 'Pass' : 'Fail',
                certificateNo: `CERT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`
            }]);
            alert(`Completed calibration for ${gageId}`);
        }
    };

    const handleAssignToMe = (gageId) => {
        const gage = scheduledGages.find(g => g.gageId === gageId);
        if (gage) {
            setScheduledGages(prev => prev.map(g =>
                g.gageId === gageId
                    ? { ...g, technician: user?.name || 'You' }
                    : g
            ));
            alert(`Assigned ${gageId} to you`);
        }
    };

    const handleReschedule = (gageId) => {
        const newDate = prompt(`Enter new date for ${gageId} (YYYY-MM-DD):`);
        if (newDate) {
            setScheduledGages(prev => prev.map(g =>
                g.gageId === gageId
                    ? { ...g, scheduledDate: newDate }
                    : g
            ));
            alert(`Rescheduled ${gageId} to ${newDate}`);
        }
    };

    const refreshData = () => {
        setLoading(true);
        setTimeout(() => {
            fetchDashboardData();
        }, 800);
    };

    // Render tab content
    const renderScheduledGages = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <CalendarCheck size={20} className="text-blue-600" />
                    Scheduled Gages for Calibration
                </h3>
                <span className="text-sm text-gray-500">{stats.scheduled} items</span>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gage ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Scheduled Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {scheduledGages.map((gage) => (
                            <tr key={gage.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900">{gage.gageId}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <span className="text-gray-700">{gage.name}</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <MapPin size={12} />
                                            {gage.location}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-gray-700">{gage.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-gray-700">{gage.scheduledDate}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gage.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            gage.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {gage.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleStartCalibration(gage.gageId)}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <PlayCircle size={14} />
                                            Start
                                        </button>
                                        <button
                                            onClick={() => handleAssignToMe(gage.gageId)}
                                            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <User size={14} />
                                            Assign to Me
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderInProgressCalibrations = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <PlayCircle size={20} className="text-yellow-600" />
                    In-Progress Calibrations
                </h3>
                <span className="text-sm text-gray-500">{stats.inProgress} active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressCalibrations.map((calibration) => (
                    <div key={calibration.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-800">{calibration.name}</h4>
                                <p className="text-sm text-gray-500">{calibration.gageId}</p>
                            </div>
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                In Progress
                            </span>
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Settings size={14} />
                                    Instrument:
                                </span>
                                <span className="text-sm font-medium">{calibration.instrumentUsed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <User size={14} />
                                    Technician:
                                </span>
                                <span className="text-sm font-medium">{calibration.technician}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Progress:</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: calibration.progress }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium ml-2">{calibration.progress}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar size={14} />
                                    Started:
                                </span>
                                <span className="text-sm font-medium">{calibration.startedDate}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCompleteCalibration(calibration.gageId)}
                                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={16} />
                                Mark Complete
                            </button>
                            <button
                                onClick={() => alert(`View details for ${calibration.gageId}`)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText size={16} />
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPendingCalibrations = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-600" />
                    Pending Calibrations
                </h3>
                <span className="text-sm text-gray-500">{stats.pending} awaiting resources</span>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gage ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Instrument Required
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reason
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pendingCalibrations.map((calibration) => (
                            <tr key={calibration.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900">{calibration.gageId}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <span className="text-gray-700">{calibration.name}</span>
                                        <p className="text-xs text-gray-500">{calibration.type}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Settings size={14} className="text-gray-400" />
                                        <div>
                                            <span className="text-gray-700">{calibration.instrumentRequired}</span>
                                            <p className="text-xs text-gray-500">{calibration.instrumentId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                        <AlertTriangle size={12} className="mr-1" />
                                        {calibration.reason}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSidebarOpen(true)}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                        >
                                            <Package size={14} />
                                            Check Instruments
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(calibration.gageId)}
                                            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                                        >
                                            <Calendar size={14} />
                                            Reschedule
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCompletedCalibrations = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    Completed Calibrations
                </h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download size={14} />
                        Export
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gage ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Completed Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Technician
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Result
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Certificate
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {completedCalibrations.map((calibration) => (
                            <tr key={calibration.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div>
                                        <span className="font-medium text-gray-900">{calibration.gageId}</span>
                                        <p className="text-xs text-gray-500">{calibration.name}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-gray-700">{calibration.completedDate}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <User size={14} className="text-gray-400" />
                                        <span className="text-gray-700">{calibration.technician}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${calibration.result === 'Pass'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {calibration.result === 'Pass' ? (
                                            <CheckCircle size={12} className="mr-1" />
                                        ) : (
                                            <AlertTriangle size={12} className="mr-1" />
                                        )}
                                        {calibration.result}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                                        <FileText size={14} />
                                        {calibration.certificateNo}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                                            View
                                        </button>
                                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Reprint
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'scheduled':
                return renderScheduledGages();
            case 'in-progress':
                return renderInProgressCalibrations();
            case 'pending':
                return renderPendingCalibrations();
            case 'completed':
                return renderCompletedCalibrations();
            default:
                return renderScheduledGages();
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
                        <h1 className="text-3xl font-bold text-gray-900">
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
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        {loading ? 'Refreshing...' : 'Refresh Dashboard'}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
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
                    icon={<AlertTriangle size={24} />}
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
                            { id: 'pending', label: 'Pending', count: stats.pending, icon: AlertTriangle },
                            { id: 'completed', label: 'Completed', count: completedCalibrations.length, icon: CheckCircle }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
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

            {/* Sidebar */}
            <MachineListSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </div>
    );
}

// Helper Components
const StatCard = ({ title, value, subtitle, color, icon }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow">
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

export default LabTechnicianDashboard;