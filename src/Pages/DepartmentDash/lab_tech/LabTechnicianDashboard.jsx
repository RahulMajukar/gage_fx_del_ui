// src/Pages/DepartmentDash/LabTechnicianDashboard.jsx
import { useState, useEffect } from "react";
import {
    CalendarCheck,
    PlayCircle,
    CheckCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    Settings,
    FileText,
    X,
    Save,
    Download,
    ChevronRight,
    Package,
    Users,
    MapPin,
    Calendar
} from "lucide-react";
import {
    fetchGagesByStatus,
    updateGageStatus,
    createCalibrationLabTechHistory
} from "./calibrationService";
import MarkCompletedForm from "../lab_tech/tables/MarkCompletedForm";

// Instrument Card Component
const InstrumentCard = ({ instrument, gageCount, onClick }) => (
    <div 
        onClick={() => onClick(instrument)}
        className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{instrument.machineName}</h3>
                            <p className="text-sm text-gray-500">{instrument.instrumentCode}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="text-gray-600">{instrument.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Settings size={12} className="text-gray-400" />
                            <span className="text-gray-600">{instrument.gageTypeName}</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${gageCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {gageCount} {gageCount === 1 ? 'gage' : 'gages'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IN_USE</p>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 ${instrument.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {instrument.status}
                        </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
            </div>
        </div>
    </div>
);

// Right Side Drawer for Instrument Details
const InstrumentDrawer = ({ instrument, gages, onClose, onCompleteCalibration, user }) => {
    const [showCompleteForm, setShowCompleteForm] = useState(false);
    const [selectedGage, setSelectedGage] = useState(null);

    const handleCompleteClick = (gage) => {
        setSelectedGage(gage);
        setShowCompleteForm(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{instrument.machineName}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-500">{instrument.instrumentCode}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${instrument.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {instrument.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <label className="text-gray-500 block">Type</label>
                            <span className="font-medium">{instrument.gageTypeName}</span>
                        </div>
                        <div>
                            <label className="text-gray-500 block">Location</label>
                            <span className="font-medium">{instrument.location}</span>
                        </div>
                        <div>
                            <label className="text-gray-500 block">Gages</label>
                            <span className="font-medium">{gages.length} IN_USE</span>
                        </div>
                    </div>
                </div>

                {/* Gages Table */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Gages in Use</h3>
                        
                        {gages.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="mx-auto text-gray-400 mb-3" size={48} />
                                <h4 className="text-gray-900 font-medium">No gages in use</h4>
                                <p className="text-gray-500 text-sm mt-1">This instrument has no gages currently in use</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gage ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {gages.map((gage) => (
                                            <tr key={gage.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <span className="font-medium text-gray-900">{gage.gageId}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-gray-700">{gage.name}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-gray-700">{gage.type}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-gray-700">{gage.location}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleCompleteClick(gage)}
                                                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Complete Calibration
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Showing {gages.length} gages assigned to this instrument
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Complete Calibration Form */}
            {showCompleteForm && selectedGage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="w-full max-w-2xl">
                        <MarkCompletedForm
                            gage={selectedGage}
                            onClose={() => {
                                setShowCompleteForm(false);
                                setSelectedGage(null);
                            }}
                            onSubmit={async (formData) => {
                                try {
                                    await onCompleteCalibration(selectedGage, formData);
                                    setShowCompleteForm(false);
                                    setSelectedGage(null);
                                } catch (error) {
                                    console.error('Failed to complete calibration:', error);
                                }
                            }}
                            loading={false}
                            user={user}
                            machine={instrument}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

function LabTechnicianDashboard({ user }) {
    const [instruments, setInstruments] = useState([]);
    const [gages, setGages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedGage, setSelectedGage] = useState(null);
    const [showCompleteForm, setShowCompleteForm] = useState(false);

    // Load instruments and gages from API
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch instruments
            const instrumentsResponse = await fetch('http://localhost:8080/api/instruments');
            if (!instrumentsResponse.ok) throw new Error('Failed to fetch instruments');
            const instrumentsData = await instrumentsResponse.json();
            setInstruments(instrumentsData);

            // Fetch gages
            const gagesResponse = await fetch('http://localhost:8080/api/gages');
            if (!gagesResponse.ok) throw new Error('Failed to fetch gages');
            const gagesData = await gagesResponse.json();
            
            // Transform API data to our format
            const transformedGages = gagesData.map(gage => ({
                id: gage.id,
                gageId: gage.serialNumber || `GAGE-${gage.id}`,
                name: gage.gageType?.name || 'Unknown Gage',
                type: gage.gageSubType?.name || 'Dimensional',
                status: gage.status || 'ACTIVE',
                location: gage.location || 'LAB',
                instrumentId: gage.inhouseCalibrationMachine?.id,
                instrumentName: gage.inhouseCalibrationMachine?.machineName,
                technician: gage.assignedTo?.name || null,
                scheduledDate: gage.nextCalibrationDate || null,
                startedDate: gage.lastCalibrationDate || null,
                originalGage: gage
            }));
            
            setGages(transformedGages);
            console.log('Data loaded successfully!');
        } catch (error) {
            console.error('Error fetching data:', error);
            // Fallback to mock data for development
            loadMockData();
        } finally {
            setLoading(false);
        }
    };

    const loadMockData = () => {
        const mockInstruments = [
            {
                id: 1,
                machineName: "boreset",
                instrumentName: "boreset",
                instrumentCode: "0011",
                accuracy: "0.1mm",
                resolution: "0.001",
                location: "lab",
                status: "Active",
                manufacturer: "nancy",
                machineEquipmentNumber: "sample",
                guaranteeExpiryDate: "2026-01-21",
                gageTypeId: 1,
                gageTypeName: "Calipers",
                gageSubTypeId: 1,
                gageSubTypeName: "Dimensional"
            },
            {
                id: 2,
                machineName: "sampleset",
                instrumentName: "sampleset",
                instrumentCode: "0012",
                accuracy: "001",
                resolution: "0.001",
                location: "lab",
                status: "Active",
                manufacturer: "nancy",
                machineEquipmentNumber: "sample2",
                guaranteeExpiryDate: "2027-01-07",
                gageTypeId: 1,
                gageTypeName: "Calipers",
                gageSubTypeId: 1,
                gageSubTypeName: "Dimensional"
            }
        ];

        const mockGages = [
            {
                id: 4,
                gageId: '331',
                name: 'Surface Plates',
                type: 'Dimensional',
                status: 'IN_USE',
                location: 'WAREHOUSE',
                instrumentId: 1,
                instrumentName: 'boreset',
                technician: 'John Doe',
                scheduledDate: '2024-01-20',
                startedDate: '2024-01-15',
                originalGage: { id: 4 }
            },
            {
                id: 5,
                gageId: '332',
                name: 'Calipers',
                type: 'Dimensional',
                status: 'IN_USE',
                location: 'LAB',
                instrumentId: 1,
                instrumentName: 'boreset',
                technician: 'Jane Smith',
                scheduledDate: '2024-01-21',
                startedDate: '2024-01-16',
                originalGage: { id: 5 }
            },
            {
                id: 6,
                gageId: '333',
                name: 'Micrometers',
                type: 'Dimensional',
                status: 'IN_USE',
                location: 'LAB',
                instrumentId: 2,
                instrumentName: 'sampleset',
                technician: null,
                scheduledDate: '2024-01-25',
                startedDate: null,
                originalGage: { id: 6 }
            }
        ];

        setInstruments(mockInstruments);
        setGages(mockGages);
    };

    // Get IN_USE gages for each instrument
    const getGagesForInstrument = (instrumentId) => {
        return gages.filter(gage => 
            gage.instrumentId === instrumentId && gage.status === 'IN_USE'
        );
    };

    // Calculate counts
    const inUseGages = gages.filter(g => g.status === 'IN_USE');
    const inProgressGages = gages.filter(g => g.status === 'IN_PROGRESS');
    const activeGages = gages.filter(g => g.status === 'ACTIVE');

    // Handle instrument click
    const handleInstrumentClick = (instrument) => {
        setSelectedInstrument(instrument);
        setShowDrawer(true);
    };

    // Handle complete calibration
    const handleCompleteCalibration = async (gage, formData) => {
        try {
            // Prepare calibration data
            const calibrationData = {
                gage: {
                    id: gage.originalGage?.id || gage.id
                },
                technician: user?.name || 'Technician',
                calibrationDate: formData.calibrationDate || new Date().toISOString().split('T')[0],
                nextCalibrationDate: formData.nextCalibrationDate,
                result: formData.result || 'PASSED',
                remarks: formData.remarks || '',
                calibratedBy: formData.calibratedBy || user?.name,
                certificateNumber: formData.certificateNumber || `CERT-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
                startedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
                calibrationDuration: 2.5,
                calibrationMachine: selectedInstrument ? {
                    id: selectedInstrument.id
                } : null
            };

            // Save calibration history
            await createCalibrationLabTechHistory(calibrationData);
            
            // Update gage status to ACTIVE
            await updateGageStatus(gage.originalGage?.id || gage.id, 'ACTIVE');
            
            // Update local state
            setGages(prev => prev.map(g => 
                g.id === gage.id 
                    ? { 
                        ...g, 
                        status: 'ACTIVE',
                        technician: null,
                        startedDate: null
                    } 
                    : g
            ));
            
            alert(`Calibration completed for ${gage.gageId}`);
            return true;
        } catch (error) {
            console.error('Failed to complete calibration:', error);
            alert('Failed to complete calibration. Please try again.');
            throw error;
        }
    };

    // Handle complete from main form
    const handleCompleteFromMain = async (gage, formData) => {
        try {
            await handleCompleteCalibration(gage, formData);
            setShowCompleteForm(false);
            setSelectedGage(null);
        } catch (error) {
            // Error already handled in handleCompleteCalibration
        }
    };

    // Handle start calibration
    const handleStartCalibration = async (gage) => {
        try {
            // Update status to IN_PROGRESS
            await updateGageStatus(gage.originalGage.id || gage.id, 'IN_PROGRESS');
            
            // Update local state
            setGages(prev => prev.map(g => 
                g.id === gage.id 
                    ? { 
                        ...g, 
                        status: 'IN_PROGRESS',
                        startedDate: new Date().toISOString().split('T')[0],
                        technician: user?.name || 'You'
                    } 
                    : g
            ));
            
            alert(`Started calibration for ${gage.gageId}`);
        } catch (error) {
            console.error('Failed to start calibration:', error);
            alert('Failed to start calibration. Please try again.');
        }
    };

    // Refresh data
    const refreshData = () => {
        setLoading(true);
        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-600" size={48} />
                <span className="ml-3 text-gray-600">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Lab Technician Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage calibration workflow
                            <span className="ml-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {user?.name || 'Technician'}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Gages in Use</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-1">{inUseGages.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Across all instruments</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Package className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-3xl font-bold text-orange-600 mt-1">{inProgressGages.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Being calibrated</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Instruments</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                {instruments.filter(i => i.status === 'Active').length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Ready for use</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Settings className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Instruments Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Calibration Instruments</h2>
                        <p className="text-gray-600">Click on an instrument to view assigned gages</p>
                    </div>
                    <span className="text-sm text-gray-500">
                        {instruments.length} instruments available
                    </span>
                </div>

                {instruments.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <Package className="mx-auto text-gray-400 mb-3" size={48} />
                        <h3 className="text-gray-900 font-medium">No instruments found</h3>
                        <p className="text-gray-500 text-sm mt-1">Add instruments to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {instruments.map((instrument) => {
                            const gagesForInstrument = getGagesForInstrument(instrument.id);
                            return (
                                <InstrumentCard
                                    key={instrument.id}
                                    instrument={instrument}
                                    gageCount={gagesForInstrument.length}
                                    onClick={handleInstrumentClick}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* In Progress Gages */}
            {inProgressGages.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Calibrations in Progress</h2>
                        <span className="text-sm text-gray-500">{inProgressGages.length} active</span>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gage ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {inProgressGages.map((gage) => (
                                    <tr key={gage.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{gage.gageId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{gage.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{gage.instrumentName || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{gage.technician || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">
                                                {gage.startedDate ? new Date(gage.startedDate).toLocaleDateString() : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedGage(gage);
                                                    setShowCompleteForm(true);
                                                }}
                                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                                            >
                                                <CheckCircle size={14} />
                                                Complete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Instrument Drawer */}
            {showDrawer && selectedInstrument && (
                <InstrumentDrawer
                    instrument={selectedInstrument}
                    gages={getGagesForInstrument(selectedInstrument.id)}
                    onClose={() => {
                        setShowDrawer(false);
                        setSelectedInstrument(null);
                    }}
                    onCompleteCalibration={handleCompleteCalibration}
                    user={user}
                />
            )}

            {/* Complete Calibration Form (for in-progress gages) */}
            {showCompleteForm && selectedGage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-2xl">
                        <MarkCompletedForm
                            gage={selectedGage}
                            onClose={() => {
                                setShowCompleteForm(false);
                                setSelectedGage(null);
                            }}
                            onSubmit={(data) => handleCompleteFromMain(selectedGage, data)}
                            loading={false}
                            user={user}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LabTechnicianDashboard;