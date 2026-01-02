// src/components/InProgressTable.jsx
import { Calendar, CheckCircle, PlayCircle, Settings, User, Clock, AlertTriangle, Download } from "lucide-react";
import { useState } from "react";
import MarkCompletedForm from "./MarkCompletedForm";
import { createCalibrationLabTechHistory, updateGageStatus } from "../calibrationService";

function InProgressTable({
    stats,
    inProgressCalibrations,
    handleCompleteCalibration,
    user,
    // Add these props if they come from parent component
    setInProgressCalibrations,
    setCompletedCalibrations,
    selectedMachine
}) {
    const [showCompleteForm, setShowCompleteForm] = useState(false);
    const [selectedCalibration, setSelectedCalibration] = useState(null);
    const [sortBy, setSortBy] = useState("startedDate");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(false);

    const handleCompleteClick = (calibration) => {
        setSelectedCalibration(calibration);
        setShowCompleteForm(true);
    };

    // Fixed handleFormSubmit function
    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            console.log('Form data received:', formData);
            console.log('Selected calibration:', selectedCalibration);
            console.log('User:', user);
            console.log('Selected machine:', selectedMachine);

            // Prepare data for API - FIXED THE STRUCTURE
            const calibrationData = {
                gage: {
                    id: selectedCalibration.originalGage?.id || selectedCalibration.id
                },
                technician: user?.name || formData.calibratedBy,
                calibrationDate: formData.calibrationDate,
                nextCalibrationDate: formData.nextCalibrationDate ||
                    new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0],
                result: formData.result, // This should be like "PASSED", "FAILED" etc.
                remarks: formData.remarks,
                calibratedBy: formData.calibratedBy,
                certificateNumber: formData.certificateNumber,
                startedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
                calibrationDuration: 2.5, // You can calculate this based on actual start time
                calibrationMachine: selectedMachine ? {
                    id: selectedMachine.id
                } : null
            };

            console.log('Sending to API:', calibrationData);

            // Save to calibration history
            const response = await createCalibrationLabTechHistory(calibrationData);
            console.log('API Response:', response);

            // Update gage status
            await updateGageStatus(
                selectedCalibration.originalGage?.id || selectedCalibration.id,
                'ACTIVE'
            );

            // If parent component provided these functions, use them
            if (setInProgressCalibrations) {
                setInProgressCalibrations(prev =>
                    prev.filter(g => g.gageId !== selectedCalibration.gageId)
                );
            }

            if (setCompletedCalibrations) {
                setCompletedCalibrations(prev => [...prev, {
                    ...selectedCalibration,
                    status: 'completed',
                    completedDate: formData.calibrationDate,
                    result: formData.result,
                    certificateNo: formData.certificateNumber,
                    technician: formData.calibratedBy,
                    remarks: formData.remarks
                }]);
            }

            // Also call the parent handler if provided
            if (handleCompleteCalibration) {
                await handleCompleteCalibration(selectedCalibration.gageId, formData);
            }

            // Close the form
            setShowCompleteForm(false);
            setSelectedCalibration(null);

            alert(`Calibration for ${selectedCalibration.gageId} completed successfully!`);

        } catch (error) {
            console.error('Failed to complete calibration:', error);
            alert(`Failed to complete calibration: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    // Simple form submit handler for backward compatibility
    const handleSimpleFormSubmit = async (formData) => {
        if (handleCompleteCalibration) {
            await handleCompleteCalibration(selectedCalibration.gageId, formData);
            setShowCompleteForm(false);
            setSelectedCalibration(null);
        }
    };

    const handleViewDetails = (calibration) => {
        alert(`Details for ${calibration.gageId}:\n\n` +
            `Name: ${calibration.name}\n` +
            `Type: ${calibration.type}\n` +
            `Instrument: ${calibration.instrumentUsed}\n` +
            `Technician: ${calibration.technician}\n` +
            `Started: ${calibration.startedDate}\n` +
            `Progress: ${calibration.progress}`
        );
    };

    const handleExport = () => {
        const data = inProgressCalibrations.map(cal => ({
            "Gage ID": cal.gageId,
            "Name": cal.name,
            "Type": cal.type,
            "Instrument": cal.instrumentUsed,
            "Technician": cal.technician,
            "Started": cal.startedDate,
            "Progress": cal.progress,
            "Status": "In Progress"
        }));

        const csv = convertToCSV(data);
        downloadCSV(csv, `in-progress-calibrations-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(header => row[header]));
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = (csvContent, fileName) => {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Sort calibrations
    const sortedCalibrations = [...inProgressCalibrations].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Handle progress values (e.g., "75%" -> 75)
        if (sortBy === "progress") {
            aValue = parseInt(aValue) || 0;
            bValue = parseInt(bValue) || 0;
        }

        // Handle dates
        if (sortBy === "startedDate" || sortBy === "dueDate") {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }

        if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const toggleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === "asc" ? "↑" : "↓";
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <PlayCircle size={24} className="text-yellow-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">In-Progress Calibrations</h2>
                            <p className="text-sm text-gray-500">Active calibration tasks assigned to technicians</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
                                {stats.inProgress} Active
                            </span>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={inProgressCalibrations.length === 0}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {inProgressCalibrations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <PlayCircle size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Calibrations</h3>
                        <p className="text-gray-500 mb-6">All calibrations are either scheduled or completed</p>
                        <div className="flex justify-center gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                                <span className="text-sm text-gray-600">Check Scheduled</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                                <span className="text-sm text-gray-600">View Completed</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-yellow-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Showing {sortedCalibrations.length} active calibrations
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="startedDate">Start Date</option>
                                        <option value="gageId">Gage ID</option>
                                        <option value="priority">Priority</option>
                                        <option value="progress">Progress</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                        className="px-2 py-1 border border-gray-300 rounded"
                                    >
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort("gageId")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Gage ID
                                                <span className="text-gray-400">{getSortIcon("gageId")}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort("startedDate")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Timeline
                                                <span className="text-gray-400">{getSortIcon("startedDate")}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedCalibrations.map((calibration) => (
                                        <tr key={calibration.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Gage ID Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                        <span className="font-mono font-bold text-gray-900">
                                                            {calibration.gageId}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                                        <Settings size={12} />
                                                        {calibration.instrumentUsed}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Details Column */}
                                            <td className="px-6 py-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{calibration.name}</h4>
                                                    <p className="text-sm text-gray-600">{calibration.type}</p>
                                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <User size={12} />
                                                            <span className="font-medium">{calibration.technician}</span>
                                                        </div>
                                                        {calibration.location && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-400">•</span>
                                                                <span>{calibration.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Timeline Column */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        <span className="text-sm font-medium">
                                                            Started: {calibration.startedDate}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-gray-400" />
                                                        <span className="text-sm">
                                                            Est. Completion: {calibration.estimatedCompletion}
                                                        </span>
                                                    </div>
                                                    {calibration.dueDate && (
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle size={14} className="text-yellow-500" />
                                                            <span className="text-sm text-yellow-700">
                                                                Due: {calibration.dueDate}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleCompleteClick(calibration)}
                                                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle size={16} />
                                                        Mark Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDetails(calibration)}
                                                        className="px-3 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Showing {sortedCalibrations.length} of {inProgressCalibrations.length} calibrations
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-xs">In Progress</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-xs">Almost Done</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Last updated: {new Date().toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Summary */}
                {inProgressCalibrations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Average Progress</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Math.round(
                                            inProgressCalibrations.reduce((sum, cal) => {
                                                const progress = parseInt(cal.progress) || 0;
                                                return sum + progress;
                                            }, 0) / inProgressCalibrations.length
                                        )}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                    <PlayCircle className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Technicians</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Set(inProgressCalibrations.map(cal => cal.technician)).size}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                    <User className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Instruments in Use</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Set(inProgressCalibrations.map(cal => cal.instrumentUsed)).size}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                    <Settings className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Today's Completion</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {inProgressCalibrations.filter(cal =>
                                            cal.estimatedCompletion &&
                                            cal.estimatedCompletion.includes(new Date().toISOString().split('T')[0])
                                        ).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-yellow-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mark Completed Form Modal */}
            {showCompleteForm && selectedCalibration && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                        onClick={() => setShowCompleteForm(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MarkCompletedForm
                                gage={selectedCalibration}
                                onClose={() => {
                                    setShowCompleteForm(false);
                                    setSelectedCalibration(null);
                                }}
                                onSubmit={handleFormSubmit}
                                onRetire={(gageId) => {
                                    alert(`Retire gage ${gageId} - This feature would retire the gage from service`);
                                }}
                                user={user}
                                machine={selectedMachine}
                                loading={loading}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default InProgressTable;