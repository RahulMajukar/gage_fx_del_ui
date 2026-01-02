// src/Pages/DepartmentDash/LabTechnicianDashboard.jsx
import { useState, useEffect } from "react";
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
import MachineListSidebar from "./MachineListSidebar";
import {
    fetchAllGages,
    fetchGagesByStatus,
    fetchGagesNeedingCalibration,
    fetchCalibrationMachines,
    apiGageToScheduled,
    getStatusBadge,
    updateGageStatus
} from "./calibrationService";
import InProgressTable from "./tables/InProgressTable";

function LabTechnicianDashboard({ user }) {
    const [scheduledGages, setScheduledGages] = useState([]);
    const [inProgressCalibrations, setInProgressCalibrations] = useState([]);
    const [pendingCalibrations, setPendingCalibrations] = useState([]);
    const [completedCalibrations, setCompletedCalibrations] = useState([]);
    const [availableInstruments, setAvailableInstruments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("scheduled");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Load data when component starts
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Main function to get all data
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            console.log("Fetching dashboard data...");

            // 1. Get scheduled gages (gages that need calibration)
            const gagesNeedingCalibration = await fetchGagesNeedingCalibration();
            console.log("Gages needing calibration:", gagesNeedingCalibration);
            const scheduled = gagesNeedingCalibration.map(apiGageToScheduled);
            setScheduledGages(scheduled);

            // 2. Get in-progress calibrations (gages with status IN_USE)
            const inProgressData = await fetchGagesByStatus('IN_USE');
            const inProgress = inProgressData.map(gage => ({
                id: gage.id,
                gageId: gage.serialNumber || `GAGE-${gage.id}`,
                name: gage.gageType?.name || 'Unknown Gage',
                type: gage.gageSubType?.name || 'Dimensional',
                instrumentUsed: gage.inhouseCalibrationMachine?.machineName || 'Standard Calibrator',
                instrumentId: gage.inhouseCalibrationMachine?.instrumentCode || `INST-${gage.inhouseCalibrationMachine?.id || '001'}`,
                calibrationType: gage.inhouseCalibrationMachine ? 'inhouse' : 'external',
                startedDate: new Date().toISOString().split('T')[0],
                technician: user?.name || 'You',
                progress: '75%',
                estimatedCompletion: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 14:00',
                status: 'in-progress',
                originalGage: gage
            }));
            setInProgressCalibrations(inProgress);

            // 3. Get pending calibrations (gages with overdue calibration)
            const allGages = await fetchAllGages();
            const today = new Date();
            const pending = allGages
                .filter(gage => {
                    if (!gage.nextCalibrationDate) return false;
                    const dueDate = new Date(gage.nextCalibrationDate);
                    return dueDate < today; // Overdue
                })
                .map(gage => ({
                    id: gage.id,
                    gageId: gage.serialNumber || `GAGE-${gage.id}`,
                    name: gage.gageType?.name || 'Unknown Gage',
                    type: gage.gageSubType?.name || 'Dimensional',
                    instrumentRequired: gage.inhouseCalibrationMachine?.machineName || 'Standard Calibrator',
                    instrumentId: gage.inhouseCalibrationMachine?.instrumentCode || `INST-${gage.inhouseCalibrationMachine?.id || '001'}`,
                    calibrationType: gage.inhouseCalibrationMachine ? 'inhouse' : 'external',
                    scheduledDate: gage.nextCalibrationDate,
                    reason: 'Calibration overdue',
                    status: 'pending',
                    originalGage: gage
                }));
            setPendingCalibrations(pending);

            // 4. Get completed calibrations (mock data for now)
            const completed = [
                {
                    id: 10,
                    gageId: 'MIT-CAL-001',
                    name: 'Calipers',
                    type: 'Dimensional',
                    instrumentUsed: 'Master Calibrator',
                    calibrationType: 'inhouse',
                    completedDate: new Date().toISOString().split('T')[0],
                    technician: user?.name || 'You',
                    result: 'Pass',
                    certificateNo: 'CERT-001-2024',
                    status: 'completed'
                },
                {
                    id: 11,
                    gageId: 'STR-MIC-001',
                    name: 'Micrometers',
                    type: 'Dimensional',
                    instrumentUsed: 'Precision Tester',
                    calibrationType: 'inhouse',
                    completedDate: new Date().toISOString().split('T')[0],
                    technician: 'Jane Smith',
                    result: 'Pass',
                    certificateNo: 'CERT-002-2024',
                    status: 'completed'
                }
            ];
            setCompletedCalibrations(completed);

            // 5. Get available calibration machines
            const machines = await fetchCalibrationMachines();
            const instruments = machines.map(machine => ({
                id: machine.id,
                name: machine.machineName,
                type: machine.gageTypeName,
                status: machine.status?.toLowerCase() || 'available',
                lastCalibration: machine.lastCalibration,
                nextCalibrationDue: machine.nextCalibrationDue,
                location: machine.location,
                currentUser: null,
                originalMachine: machine
            }));
            setAvailableInstruments(instruments);

            console.log("Data loaded successfully!");
            setLoading(false);

        } catch (error) {
            console.error("Error loading data:", error);
            // If API fails, use mock data
            loadMockData();
            setLoading(false);
        }
    };

    // Fallback mock data if API fails
    const loadMockData = () => {
        console.log("Using mock data...");

        const mockScheduled = [
            {
                id: 2,
                gageId: 'STR-MIC-001',
                name: 'Micrometers',
                type: 'Dimensional',
                instrumentRequired: 'boreset',
                instrumentId: 'INST-001',
                calibrationType: 'inhouse',
                scheduledDate: '2026-01-24',
                dueDate: '2026-12-08',
                priority: 'Medium',
                status: 'scheduled',
                location: 'LAB',
                requestedBy: 'System',
                requestDate: '2024-01-20',
                technician: null,
                originalGage: { id: 2, serialNumber: 'STR-MIC-001' }
            },
            {
                id: 8,
                gageId: '330',
                name: 'Micrometers',
                type: 'Mechanical',
                instrumentRequired: 'boreset',
                instrumentId: 'INST-001',
                calibrationType: 'inhouse',
                scheduledDate: '2026-01-24',
                dueDate: '2026-01-09',
                priority: 'Low',
                status: 'scheduled',
                location: 'WAREHOUSE',
                requestedBy: 'System',
                requestDate: '2024-01-21',
                technician: null,
                originalGage: { id: 8, serialNumber: '330' }
            }
        ];

        const mockInProgress = [
            {
                id: 6,
                gageId: '6769micro',
                name: 'Micrometers',
                type: 'Mechanical',
                instrumentUsed: 'Master Calibrator',
                instrumentId: 'INST-001',
                calibrationType: 'inhouse',
                startedDate: new Date().toISOString().split('T')[0],
                technician: user?.name || 'You',
                progress: '75%',
                estimatedCompletion: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 14:00',
                status: 'in-progress',
                originalGage: { id: 6, serialNumber: '6769micro' }
            }
        ];

        const mockPending = [
            {
                id: 4,
                gageId: '001',
                name: 'Calipers',
                type: 'Dimensional',
                instrumentRequired: 'Standard Calibrator',
                instrumentId: 'INST-002',
                calibrationType: 'inhouse',
                scheduledDate: '2025-12-25',
                reason: 'Calibration overdue',
                status: 'pending',
                originalGage: { id: 4, serialNumber: '001' }
            }
        ];

        const mockInstruments = [
            {
                id: '1',
                name: 'boreset',
                type: 'Calipers',
                status: 'available',
                lastCalibration: '2024-01-10',
                nextCalibrationDue: '2024-07-10',
                location: 'Lab',
                currentUser: null
            }
        ];

        setScheduledGages(mockScheduled);
        setInProgressCalibrations(mockInProgress);
        setPendingCalibrations(mockPending);
        setCompletedCalibrations([
            {
                id: 10,
                gageId: 'MIT-CAL-001',
                name: 'Calipers',
                type: 'Dimensional',
                instrumentUsed: 'Master Calibrator',
                calibrationType: 'inhouse',
                completedDate: new Date().toISOString().split('T')[0],
                technician: user?.name || 'You',
                result: 'Pass',
                certificateNo: 'CERT-001-2024',
                status: 'completed'
            }
        ]);
        setAvailableInstruments(mockInstruments);
    };

    // Calculate statistics
    const stats = {
        scheduled: scheduledGages.length,
        inProgress: inProgressCalibrations.length,
        pending: pendingCalibrations.length,
        completedToday: completedCalibrations.filter(g =>
            g.completedDate === new Date().toISOString().split('T')[0]
        ).length,
        availableInstruments: availableInstruments.filter(i => i.status === 'available').length
    };

    // Start calibration
    const handleStartCalibration = async (gageId) => {
        const gage = scheduledGages.find(g => g.gageId === gageId);
        if (gage) {
            try {
                // Update status in backend
                await updateGageStatus(gage.originalGage.id, 'IN_USE');

                // Update local state
                setScheduledGages(prev => prev.filter(g => g.gageId !== gageId));
                setInProgressCalibrations(prev => [...prev, {
                    ...gage,
                    status: 'in-progress',
                    startedDate: new Date().toISOString().split('T')[0],
                    technician: user?.name || 'You',
                    progress: '0%'
                }]);

                alert(`Started calibration for ${gageId}`);
            } catch (error) {
                console.error('Failed to start calibration:', error);
                alert('Failed to start calibration. Please try again.');
            }
        }
    };

    // Complete calibration
    const handleCompleteCalibration = async (gageId) => {
        const gage = inProgressCalibrations.find(g => g.gageId === gageId);
        if (gage) {
            try {
                // Update status in backend
                await updateGageStatus(gage.originalGage.id, 'ACTIVE');

                // Update local state
                setInProgressCalibrations(prev => prev.filter(g => g.gageId !== gageId));
                setCompletedCalibrations(prev => [...prev, {
                    ...gage,
                    status: 'completed',
                    completedDate: new Date().toISOString().split('T')[0],
                    result: Math.random() > 0.2 ? 'Pass' : 'Fail',
                    certificateNo: `CERT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`
                }]);

                alert(`Completed calibration for ${gageId}`);
            } catch (error) {
                console.error('Failed to complete calibration:', error);
                alert('Failed to complete calibration. Please try again.');
            }
        }
    };

    // Assign gage to technician
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

    // Reschedule calibration
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

    // Refresh all data
    const refreshData = () => {
        setLoading(true);
        fetchDashboardData();
    };

    // Render scheduled gages table
    const renderScheduledGages = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <CalendarCheck size={20} className="text-blue-600" />
                    Scheduled Gages for Calibration
                </h3>
                <span className="text-sm text-gray-500">{stats.scheduled} items</span>
            </div>

            {scheduledGages.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <CalendarCheck size={48} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-gray-900 font-medium">No scheduled calibrations</h3>
                    <p className="text-gray-500 text-sm mt-1">All gages are up to date!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gage ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
            )}
        </div>
    );

    // Render in-progress calibrations


    // Render pending calibrations
    const renderPendingCalibrations = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-600" />
                    Pending Calibrations
                </h3>
                <span className="text-sm text-gray-500">{stats.pending} awaiting resources</span>
            </div>

            {pendingCalibrations.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <AlertTriangle size={48} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-gray-900 font-medium">No pending calibrations</h3>
                    <p className="text-gray-500 text-sm mt-1">All calibrations are on schedule</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gage ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument Required</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
            )}
        </div>
    );

    // Render completed calibrations
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

            {completedCalibrations.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-gray-900 font-medium">No completed calibrations</h3>
                    <p className="text-gray-500 text-sm mt-1">Complete a calibration to see it here</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gage ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
            )}
        </div>
    );

    // Show content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'scheduled':
                return renderScheduledGages();
            case 'in-progress':
                return (
                    <InProgressTable
                        stats={stats}
                        inProgressCalibrations={inProgressCalibrations}
                        handleCompleteCalibration={handleCompleteCalibration}
                    />
                );

            case 'pending':
                return renderPendingCalibrations();
            case 'completed':
                return renderCompletedCalibrations();
            default:
                return renderScheduledGages();
        }
    };

    // Show loading spinner
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="animate-spin text-blue-600" size={48} />
                    <span className="ml-3 text-gray-600">Loading dashboard data...</span>
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

            {/* Quick Stats Cards */}
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

            {/* Sidebar for Instruments */}
            <MachineListSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </div>
    );
}

// Small stat card component
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