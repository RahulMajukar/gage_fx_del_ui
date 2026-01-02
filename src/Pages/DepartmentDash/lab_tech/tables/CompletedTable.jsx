// src/components/CompletedTable.jsx
import { AlertTriangle, Calendar, CheckCircle, Download, FileText, Filter, User, Settings, Clock, RefreshCw, Search, ChevronDown } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { fetchCompletedCalibrations, fetchGageDetails, formatDate, formatDateTime } from '../calibrationService'

function CompletedTable() {
    const [completedCalibrations, setCompletedCalibrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterResult, setFilterResult] = useState('all')
    const [sortBy, setSortBy] = useState('completedAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedCalibration, setSelectedCalibration] = useState(null)
    const [showDetails, setShowDetails] = useState(false)

    // Fetch data on component mount
    useEffect(() => {
        fetchCalibrations()
    }, [])

    const fetchCalibrations = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchCompletedCalibrations()
            
            // Enhance data with gage details
            const enhancedData = await Promise.all(
                data.map(async (calibration) => {
                    try {
                        const gageDetails = await fetchGageDetails(calibration.gageId)
                        return {
                            ...calibration,
                            gageSerialNumber: gageDetails?.serialNumber || `GAGE-${calibration.gageId}`,
                            gageModelNumber: gageDetails?.modelNumber || 'N/A',
                            gageType: gageDetails?.gageType?.name || 'Unknown',
                            gageLocation: gageDetails?.location || 'N/A',
                            measurementRange: gageDetails?.measurementRange || 'N/A',
                            accuracy: gageDetails?.accuracy || 'N/A'
                        }
                    } catch (error) {
                        console.error(`Error fetching details for gage ${calibration.gageId}:`, error)
                        return {
                            ...calibration,
                            gageSerialNumber: `GAGE-${calibration.gageId}`,
                            gageModelNumber: 'N/A',
                            gageType: 'Unknown',
                            gageLocation: 'N/A',
                            measurementRange: 'N/A',
                            accuracy: 'N/A'
                        }
                    }
                })
            )
            
            setCompletedCalibrations(enhancedData)
        } catch (error) {
            console.error('Error fetching calibrations:', error)
            setError('Failed to load completed calibrations. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        fetchCalibrations()
    }

    const handleExport = () => {
        const data = filteredCalibrations.map(cal => ({
            "Certificate Number": cal.certificateNumber,
            "Gage ID": cal.gageSerialNumber,
            "Gage Model": cal.gageModelNumber,
            "Gage Type": cal.gageType,
            "Calibration Date": formatDate(cal.calibrationDate),
            "Next Calibration": formatDate(cal.nextCalibrationDate),
            "Technician": cal.technician,
            "Calibrated By": cal.calibratedBy,
            "Result": cal.result,
            "Duration (hours)": cal.calibrationDuration,
            "Remarks": cal.remarks,
            "Started At": formatDateTime(cal.startedAt),
            "Completed At": formatDateTime(cal.completedAt)
        }))

        const csv = convertToCSV(data)
        downloadCSV(csv, `completed-calibrations-${new Date().toISOString().split('T')[0]}.csv`)
    }

    const convertToCSV = (data) => {
        if (!data || data.length === 0) return ''
        const headers = Object.keys(data[0])
        const rows = data.map(row => headers.map(header => {
            const value = row[header] || ''
            // Escape quotes and wrap in quotes if contains comma
            return `"${value.toString().replace(/"/g, '""')}"`
        }))
        return [headers, ...rows].map(row => row.join(',')).join('\n')
    }

    const downloadCSV = (csvContent, fileName) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const handleViewDetails = (calibration) => {
        setSelectedCalibration(calibration)
        setShowDetails(true)
    }

    const handleReprint = (calibration) => {
        alert(`Reprint certificate for ${calibration.certificateNumber}\n\nThis would generate a PDF certificate for this calibration.`)
    }

    // Filter and sort calibrations
    const filteredCalibrations = completedCalibrations.filter(cal => {
        const matchesSearch = 
            cal.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.gageSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.technician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.calibratedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesResult = filterResult === 'all' || cal.result === filterResult
        
        return matchesSearch && matchesResult
    })

    const sortedCalibrations = [...filteredCalibrations].sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]
        
        if (sortBy === 'calibrationDate' || sortBy === 'completedAt' || sortBy === 'startedAt') {
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    const getResultColor = (result) => {
        switch (result) {
            case 'PASSED': return 'bg-green-100 text-green-800'
            case 'FAILED': return 'bg-red-100 text-red-800'
            case 'ADJUSTED': return 'bg-yellow-100 text-yellow-800'
            case 'OUT_OF_TOLERANCE': return 'bg-orange-100 text-orange-800'
            case 'OBSOLETE': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getResultIcon = (result) => {
        switch (result) {
            case 'PASSED': return <CheckCircle size={12} className="mr-1" />
            case 'FAILED': return <AlertTriangle size={12} className="mr-1" />
            case 'ADJUSTED': return <Settings size={12} className="mr-1" />
            default: return <AlertTriangle size={12} className="mr-1" />
        }
    }

    const resultOptions = [
        { value: 'all', label: 'All Results' },
        { value: 'PASSED', label: 'Passed' },
        { value: 'FAILED', label: 'Failed' },
        { value: 'ADJUSTED', label: 'Adjusted' },
        { value: 'OUT_OF_TOLERANCE', label: 'Out of Tolerance' },
        { value: 'OBSOLETE', label: 'Obsolete' }
    ]

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600" />
                        Completed Calibrations
                    </h3>
                </div>
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <RefreshCw className="mx-auto animate-spin text-blue-600 mb-3" size={48} />
                    <h3 className="text-gray-900 font-medium">Loading calibrations...</h3>
                    <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the data</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600" />
                        Completed Calibrations
                    </h3>
                    <button
                        onClick={handleRefresh}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <AlertTriangle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-gray-900 font-medium">Error Loading Data</h3>
                    <p className="text-gray-500 text-sm mt-1">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" />
                            Completed Calibrations
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {completedCalibrations.length} total calibrations • {filteredCalibrations.length} filtered
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={filteredCalibrations.length === 0}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={14} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by certificate, gage ID, technician..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Result</label>
                            <select
                                value={filterResult}
                                onChange={(e) => setFilterResult(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {resultOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Sort by: 
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded"
                            >
                                <option value="completedAt">Completion Date</option>
                                <option value="calibrationDate">Calibration Date</option>
                                <option value="certificateNumber">Certificate Number</option>
                                <option value="gageSerialNumber">Gage ID</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="ml-2 px-2 py-1 border border-gray-300 rounded"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>

                {sortedCalibrations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <CheckCircle size={48} className="mx-auto text-gray-400 mb-3" />
                        <h3 className="text-gray-900 font-medium">No completed calibrations found</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {searchTerm || filterResult !== 'all' 
                                ? 'Try adjusting your search or filters' 
                                : 'Complete a calibration to see it here'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Certificate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gage Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calibration Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Result
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedCalibrations.map((calibration) => (
                                        <tr key={calibration.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-mono font-bold text-gray-900">
                                                        {calibration.certificateNumber}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {formatDate(calibration.calibrationDate)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(calibration.nextCalibrationDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {calibration.gageSerialNumber}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {calibration.gageModelNumber}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {calibration.gageType}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-gray-400" />
                                                        <div>
                                                            <div className="text-sm font-medium">{calibration.technician}</div>
                                                            <div className="text-xs text-gray-500">by {calibration.calibratedBy}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Duration: {calibration.calibrationDuration} hours
                                                    </div>
                                                    {calibration.remarks && (
                                                        <div className="text-xs text-gray-500 truncate max-w-xs" title={calibration.remarks}>
                                                            {calibration.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultColor(calibration.result)}`}>
                                                    {getResultIcon(calibration.result)}
                                                    {calibration.result}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(calibration)}
                                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                                                    >
                                                        <FileText size={14} />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleReprint(calibration)}
                                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                                    >
                                                        <Download size={14} />
                                                        Reprint
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
                                    Showing {sortedCalibrations.length} of {filteredCalibrations.length} calibrations
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Summary */}
                {completedCalibrations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Calibrations</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {completedCalibrations.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Passed</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {completedCalibrations.filter(c => c.result === 'PASSED').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Failed</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {completedCalibrations.filter(c => c.result === 'FAILED').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Avg Duration</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(completedCalibrations.reduce((sum, cal) => sum + (cal.calibrationDuration || 0), 0) / completedCalibrations.length).toFixed(1)}h
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                    <Clock className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Calibration Details Modal */}
            {showDetails && selectedCalibration && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                        onClick={() => setShowDetails(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-600" size={24} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Calibration Details</h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedCalibration.certificateNumber}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <ChevronDown size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">Certificate Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Certificate Number:</span>
                                                    <span className="font-medium">{selectedCalibration.certificateNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Calibration Date:</span>
                                                    <span className="font-medium">{formatDate(selectedCalibration.calibrationDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Next Calibration:</span>
                                                    <span className="font-medium text-blue-600">{formatDate(selectedCalibration.nextCalibrationDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">Gage Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Serial Number:</span>
                                                    <span className="font-medium">{selectedCalibration.gageSerialNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Model:</span>
                                                    <span className="font-medium">{selectedCalibration.gageModelNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Type:</span>
                                                    <span className="font-medium">{selectedCalibration.gageType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Location:</span>
                                                    <span className="font-medium">{selectedCalibration.gageLocation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">Calibration Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Technician:</span>
                                                    <span className="font-medium">{selectedCalibration.technician}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Calibrated By:</span>
                                                    <span className="font-medium">{selectedCalibration.calibratedBy}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Duration:</span>
                                                    <span className="font-medium">{selectedCalibration.calibrationDuration} hours</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Started:</span>
                                                    <span className="font-medium">{formatDateTime(selectedCalibration.startedAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Completed:</span>
                                                    <span className="font-medium">{formatDateTime(selectedCalibration.completedAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">Result</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getResultColor(selectedCalibration.result)}`}>
                                                    {getResultIcon(selectedCalibration.result)}
                                                    {selectedCalibration.result}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedCalibration.remarks && (
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Remarks</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {selectedCalibration.remarks}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={() => handleReprint(selectedCalibration)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Reprint Certificate
                                </button>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default CompletedTable