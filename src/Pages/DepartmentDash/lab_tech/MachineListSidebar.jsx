// src/Pages/DepartmentDash/components/MachineListSidebar.jsx
import React, { useState, useEffect } from "react";
import {
    X,
    Package,
    Database,
    AlertTriangle,
    CheckCircle,
    ArrowLeft,
    Search,
    Filter,
    ChevronRight,
    ChevronDown,
    Calendar,
    MapPin,
    Settings,
    FileText,
    RefreshCcw
} from "lucide-react";

function MachineListSidebar({ isOpen, onClose }) {
    const [view, setView] = useState("machines"); // "machines" or "gages"
    const [machines, setMachines] = useState([]);
    const [gages, setGages] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState([]);

    // Fetch machines when sidebar opens
    useEffect(() => {
        if (isOpen && view === "machines") {
            fetchMachines();
        }
    }, [isOpen, view]);

    const fetchMachines = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:8080/api/inhouse-calibration-machines/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setMachines(data);
        } catch (err) {
            console.error("Failed to fetch machines:", err);
            setError("Failed to load instruments. Please try again.");
            setMachines([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGages = async (machineId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:8080/api/gages/by-machine/${machineId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setGages(data);
            setView("gages");
        } catch (err) {
            console.error("Failed to fetch gages:", err);
            setError("Failed to load gages. Please try again.");
            setGages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMachineClick = (machine) => {
        setSelectedMachine(machine);
        fetchGages(machine.id);
    };

    const toggleRowExpand = (machineId) => {
        setExpandedRows(prev =>
            prev.includes(machineId)
                ? prev.filter(id => id !== machineId)
                : [...prev, machineId]
        );
    };

    const goBack = () => {
        setView("machines");
        setSelectedMachine(null);
        setGages([]);
        setSearchTerm("");
    };

    const filteredMachines = machines.filter(machine =>
        machine.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.instrumentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.instrumentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.gageTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    const getStatusBadge = (status) => {
        const statusMap = {
            'active': { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} /> },
            'inactive': { color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle size={14} /> },
            'maintenance': { color: 'bg-yellow-100 text-yellow-800', icon: <Settings size={14} /> },
            'in-use': { color: 'bg-blue-100 text-blue-800', icon: <Database size={14} /> }
        };

        const statusLower = status?.toLowerCase();
        const config = statusMap[statusLower] || { color: 'bg-gray-100 text-gray-800', icon: <Database size={14} /> };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return "Invalid Date";
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    {view === "gages" ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goBack}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Gages for {selectedMachine?.machineName}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedMachine?.instrumentCode} • {selectedMachine?.gageTypeName}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="text-blue-600" size={24} />
                                Calibration Instruments
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                View and manage all calibration machines
                            </p>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Search Bar - Only show in machines view */}
                {view === "machines" && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search machines by name, code, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                {filteredMachines.length} results
                            </div>
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <AlertTriangle className="mx-auto text-red-500 mb-3" size={32} />
                            <p className="text-red-600 font-medium mb-2">Failed to load data</p>
                            <p className="text-gray-500 text-sm mb-4">{error}</p>
                            <button
                                onClick={view === "machines" ? fetchMachines : () => fetchGages(selectedMachine?.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    ) : view === "machines" ? (
                        <div className="p-4">
                            {filteredMachines.length === 0 ? (
                                <div className="text-center py-12">
                                    <Database className="mx-auto text-gray-400 mb-3" size={48} />
                                    <h3 className="text-gray-900 font-medium mb-1">No instruments found</h3>
                                    <p className="text-gray-500 text-sm">
                                        {searchTerm ? "Try adjusting your search terms" : "No calibration machines available"}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Machine Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Specifications
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredMachines.map((machine) => {
                                                const isExpanded = expandedRows.includes(machine.id);
                                                return (
                                                    <React.Fragment key={machine.id}>
                                                        <tr className="hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <button
                                                                        onClick={() => toggleRowExpand(machine.id)}
                                                                        className="p-1 hover:bg-gray-200 rounded mr-2"
                                                                    >
                                                                        {isExpanded ? (
                                                                            <ChevronDown size={16} className="text-gray-500" />
                                                                        ) : (
                                                                            <ChevronRight size={16} className="text-gray-500" />
                                                                        )}
                                                                    </button>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <h3 className="font-semibold text-gray-900">
                                                                                {machine.machineName}
                                                                            </h3>
                                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                                {machine.instrumentCode}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            {machine.instrumentName}
                                                                        </p>
                                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                                            <span className="flex items-center gap-1">
                                                                                <MapPin size={12} />
                                                                                {machine.location}
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar size={12} />
                                                                                Expires: {formatDate(machine.guaranteeExpiryDate)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="space-y-1">
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Type: </span>
                                                                        <span className="font-medium">{machine.gageTypeName}</span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Subtype: </span>
                                                                        <span className="font-medium">{machine.gageSubTypeName}</span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Accuracy: </span>
                                                                        <span className="font-medium">{machine.accuracy}</span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Resolution: </span>
                                                                        <span className="font-medium">{machine.resolution}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {getStatusBadge(machine.status)}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    onClick={() => handleMachineClick(machine)}
                                                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                                >
                                                                    <FileText size={14} />
                                                                    View Gages
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {/* Expanded Row */}
                                                        {isExpanded && (
                                                            <tr>
                                                                <td colSpan={4} className="bg-gray-50 px-6 py-4">
                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                        <div>
                                                                            <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
                                                                            <div className="space-y-1">
                                                                                <div>
                                                                                    <span className="text-gray-500">Manufacturer: </span>
                                                                                    <span className="font-medium">{machine.manufacturer || "N/A"}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-gray-500">Equipment #: </span>
                                                                                    <span className="font-medium">{machine.machineEquipmentNumber || "N/A"}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium text-gray-700 mb-2">Calibration Details</h4>
                                                                            <div className="space-y-1">
                                                                                <div>
                                                                                    <span className="text-gray-500">Last Calibration: </span>
                                                                                    <span className="font-medium">N/A</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-gray-500">Next Due: </span>
                                                                                    <span className="font-medium">N/A</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Gage Table View
                        <div className="p-4">
                            {gages.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="mx-auto text-gray-400 mb-3" size={48} />
                                    <h3 className="text-gray-900 font-medium mb-1">No gages found</h3>
                                    <p className="text-gray-500 text-sm">
                                        No gages are assigned to this calibration machine
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gage Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Specifications
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Calibration
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {gages.map((gage) => (
                                                <tr key={gage.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-semibold text-gray-900">
                                                                    {gage.gageType?.name || "Unknown Gage"}
                                                                </h3>
                                                                {gage.serialNumber && (
                                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                        {gage.serialNumber}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {gage.modelNumber && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Model: {gage.modelNumber}
                                                                </p>
                                                            )}
                                                            {gage.location && (
                                                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                                    <MapPin size={12} />
                                                                    {gage.location}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            {gage.measurementRange && (
                                                                <div className="text-sm">
                                                                    <span className="text-gray-500">Range: </span>
                                                                    <span className="font-medium">{gage.measurementRange}</span>
                                                                </div>
                                                            )}
                                                            {gage.accuracy && (
                                                                <div className="text-sm">
                                                                    <span className="text-gray-500">Accuracy: </span>
                                                                    <span className="font-medium">{gage.accuracy}</span>
                                                                </div>
                                                            )}
                                                            {gage.gageSubType?.name && (
                                                                <div className="text-sm">
                                                                    <span className="text-gray-500">Subtype: </span>
                                                                    <span className="font-medium">{gage.gageSubType.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(gage.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {gage.nextCalibrationDate ? (
                                                            <div className="text-sm">
                                                                <div className="text-gray-500">Next Calibration:</div>
                                                                <div className="font-medium text-blue-600">
                                                                    {formatDate(gage.nextCalibrationDate)}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Not scheduled</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => console.log("Start calibration for", gage.id)}
                                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                                                            title={`Calibrate ${gage.gageType?.name || gage.id}`}
                                                        >
                                                            <Settings size={14} />
                                                            Calibrate
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {view === "machines"
                                ? `Showing ${filteredMachines.length} of ${machines.length} instruments`
                                : `Showing ${gages.length} gages for ${selectedMachine?.machineName}`}
                        </div>
                        <div className="flex gap-2">
                            {view === "machines" && (
                                <button
                                    onClick={fetchMachines}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <RefreshCcw size={14} />
                                    Refresh
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MachineListSidebar;