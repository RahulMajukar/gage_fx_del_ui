// src/components/MarkCompletedForm.jsx
import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle, Settings, Save, Trash2 } from "lucide-react";

function MarkCompletedForm({
  gage,
  onClose,
  onSubmit,
  onRetire,
  loading = false
}) {
  const [formData, setFormData] = useState({
    result: "PASS",
    calibratedBy: "",
    remarks: "",
    certificateNumber: `CERT-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
    calibrationDate: new Date().toISOString().split('T')[0],
    nextCalibrationDate: "",
    calibrationStandardUsed: gage?.instrumentUsed || "",
    environmentalConditions: "23°C, 50% RH",
    measurementUncertainty: "±0.001mm"
  });

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

    // Auto-set next calibration date when result is selected
    if (name === 'result' && value === 'PASS') {
      setFormData(prev => ({
        ...prev,
        nextCalibrationDate: calculateNextCalibrationDate()
      }));
    } else if (name === 'result' && value !== 'PASS') {
      setFormData(prev => ({
        ...prev,
        nextCalibrationDate: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Handle retire button
  const handleRetire = () => {
    if (window.confirm(`Are you sure you want to retire ${gage?.gageId}? This action cannot be undone.`)) {
      onRetire(gage?.originalGage?.id);
    }
  };

  const resultOptions = [
    { value: "PASS", label: "Pass", color: "text-green-600", bgColor: "bg-green-50" },
    { value: "FAIL", label: "Failed", color: "text-red-600", bgColor: "bg-red-50" },
    { value: "ADJUSTED", label: "Adjusted", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { value: "OUT_OF_TOLERANCE", label: "Out of Tolerance", color: "text-orange-600", bgColor: "bg-orange-50" },
    { value: "OBSOLETE", label: "Obsolete", color: "text-gray-600", bgColor: "bg-gray-50" }
  ];

  const getResultIcon = (result) => {
    switch (result) {
      case "PASS": return <CheckCircle className="text-green-500" size={18} />;
      case "FAIL": return <AlertTriangle className="text-red-500" size={18} />;
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
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Calibration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Number
              </label>
              <input
                type="text"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Date
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
                disabled={formData.result !== 'PASS'}
                required={formData.result === 'PASS'}
              />
              {formData.result !== 'PASS' && (
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calibration Standard Used
              </label>
              <input
                type="text"
                name="calibrationStandardUsed"
                value={formData.calibrationStandardUsed}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Environmental Conditions
              </label>
              <input
                type="text"
                name="environmentalConditions"
                value={formData.environmentalConditions}
                onChange={handleChange}
                placeholder="e.g., 23°C, 50% RH"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Gage Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Serial Number:</span>
                <span className="font-medium ml-2">{gage?.gageId}</span>
              </div>
              <div>
                <span className="text-gray-500">Model:</span>
                <span className="font-medium ml-2">{gage?.modelNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="font-medium ml-2">{gage?.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Subtype:</span>
                <span className="font-medium ml-2">{gage?.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Measurement Range:</span>
                <span className="font-medium ml-2">{gage?.measurementRange || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium ml-2">{gage?.accuracy || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleRetire}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Retire Gage
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Mark as Complete
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