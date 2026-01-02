// src/components/MarkCompletedForm.jsx
import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Settings, Save, Trash2, Clock, Calendar, User } from "lucide-react";
import { createCalibrationLabTechHistory, updateGageStatus } from "../calibrationService";

function MarkCompletedForm({
  gage,
  onClose,
  onSubmit,
  onRetire,
  loading = false,
  user,
  machine
}) {
  const [formData, setFormData] = useState({
    result: "PASSED",
    calibratedBy: "",
    remarks: "",
    certificateNumber: `CERT-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
    calibrationDate: new Date().toISOString().split('T')[0],
    nextCalibrationDate: "",
    calibrationStandardUsed: gage?.instrumentUsed || "",
    environmentalConditions: "23°C, 50% RH",
    measurementUncertainty: "±0.001mm"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default calibratedBy to current user
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        calibratedBy: user.name
      }));
    }
  }, [user]);

  // Calculate next calibration date (default: 12 months from now)
  const calculateNextCalibrationDate = () => {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 12);
    return nextDate.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-set next calibration date when result is PASSED
    if (name === 'result' && value === 'PASSED') {
      setFormData(prev => ({
        ...prev,
        nextCalibrationDate: calculateNextCalibrationDate()
      }));
    } else if (name === 'result' && value !== 'PASSED') {
      setFormData(prev => ({
        ...prev,
        nextCalibrationDate: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for the API
      const calibrationData = {
        gage: {
          id: gage.originalGage?.id || gage.id
        },
        technician: user?.name || formData.calibratedBy || 'Technician',
        calibrationDate: formData.calibrationDate,
        nextCalibrationDate: formData.nextCalibrationDate || calculateNextCalibrationDate(),
        result: formData.result,
        remarks: formData.remarks,
        calibratedBy: formData.calibratedBy,
        certificateNumber: formData.certificateNumber,
        startedAt: new Date().toISOString(), // Started now (you might want to adjust this)
        completedAt: new Date().toISOString(),
        calibrationDuration: 2.5, // Default 2.5 hours, adjust as needed
        calibrationMachine: machine ? {
          id: machine.id
        } : null
      };

      console.log('Submitting calibration data:', calibrationData);

      // Call the API to save calibration history
      const response = await createCalibrationLabTechHistory(calibrationData);
      
      // Update gage status to ACTIVE
      await updateGageStatus(gage.originalGage?.id || gage.id, 'ACTIVE');
      
      // Call the parent onSubmit handler if provided
      if (onSubmit) {
        onSubmit(response);
      }
      
      // Close the form
      onClose();
      
      alert(`Calibration for ${gage.gageId} marked as complete! Certificate: ${formData.certificateNumber}`);
      
    } catch (error) {
      console.error('Failed to submit calibration:', error);
      alert('Failed to submit calibration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle retire button
  const handleRetire = () => {
    if (window.confirm(`Are you sure you want to retire ${gage?.gageId}? This action cannot be undone.`)) {
      if (onRetire) {
        onRetire(gage?.originalGage?.id || gage.id);
      }
    }
  };

  const resultOptions = [
    { value: "PASSED", label: "Pass", color: "text-green-600", bgColor: "bg-green-50" },
    { value: "FAILED", label: "Failed", color: "text-red-600", bgColor: "bg-red-50" },
    { value: "ADJUSTED", label: "Adjusted", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { value: "OUT_OF_TOLERANCE", label: "Out of Tolerance", color: "text-orange-600", bgColor: "bg-orange-50" },
    { value: "OBSOLETE", label: "Obsolete", color: "text-gray-600", bgColor: "bg-gray-50" }
  ];

  const getResultIcon = (result) => {
    switch (result) {
      case "PASSED": return <CheckCircle className="text-green-500" size={18} />;
      case "FAILED": return <AlertTriangle className="text-red-500" size={18} />;
      case "ADJUSTED": return <Settings className="text-yellow-500" size={18} />;
      default: return <AlertTriangle className="text-orange-500" size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mark Calibration as Complete</h3>
            <p className="text-sm text-gray-500">
              {gage?.gageId} • {gage?.name}
            </p>
            {machine && (
              <p className="text-xs text-gray-400 mt-1">
                Machine: {machine.machineName} ({machine.instrumentCode})
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Timeline Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-blue-700">Calibration Timeline</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Started: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-500" />
                <span className="text-gray-600">Today's Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-500" />
                <span className="text-gray-600">Technician:</span>
                <span className="font-medium">{user?.name || 'You'}</span>
              </div>
            </div>
          </div>

          {/* Calibration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Number *
              </label>
              <input
                type="text"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated certificate number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Date *
              </label>
              <input
                type="date"
                name="calibrationDate"
                value={formData.calibrationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Result *
              </label>
              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {resultOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* Result Indicator */}
              <div className="mt-2 flex items-center gap-2">
                {getResultIcon(formData.result)}
                <span className={`text-sm font-medium ${resultOptions.find(o => o.value === formData.result)?.color}`}>
                  {resultOptions.find(o => o.value === formData.result)?.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Calibration Date
              </label>
              <input
                type="date"
                name="nextCalibrationDate"
                value={formData.nextCalibrationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.result !== 'PASSED'}
                required={formData.result === 'PASSED'}
              />
              {formData.result !== 'PASSED' && (
                <p className="text-xs text-gray-500 mt-1">
                  Next calibration date not required for failed results
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibrated By *
              </label>
              <input
                type="text"
                name="calibratedBy"
                value={formData.calibratedBy}
                onChange={handleChange}
                placeholder="Enter technician name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Person who performed the calibration</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks / Notes
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any remarks, observations, or notes about the calibration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Gage Information Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Settings size={16} className="text-gray-500" />
              Gage Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Serial Number:</span>
                <span className="font-medium text-gray-900">{gage?.gageId}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Model:</span>
                <span className="font-medium text-gray-900">{gage?.modelNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Type:</span>
                <span className="font-medium text-gray-900">{gage?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Subtype:</span>
                <span className="font-medium text-gray-900">{gage?.type}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Measurement Range:</span>
                <span className="font-medium text-gray-900">{gage?.measurementRange || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Accuracy:</span>
                <span className="font-medium text-gray-900">{gage?.accuracy || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleRetire}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Retire Gage
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save & Complete
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MarkCompletedForm;