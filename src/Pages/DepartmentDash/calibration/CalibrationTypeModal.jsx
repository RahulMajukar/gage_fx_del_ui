// src/components/dashboard/CalibrationTypeModal.jsx
import React from 'react';
import { Home, Building2, AlertTriangle } from 'lucide-react';

// In your CalibrationTypeModal component, update it to show machine details:
const CalibrationTypeModal = ({ 
  isOpen, 
  onClose, 
  onSelectInHouse, 
  onSelectOutService,
  isLoading,
  gageData, // Pass the entire gage object
  hasInHouseMachine // Function result
}) => {
  if (!isOpen) return null;

  const machine = gageData?.inhouseCalibrationMachine;
  const canUseInHouse = hasInHouseMachine;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Select Calibration Type</h3>
          <p className="text-gray-600 mt-2">
            Choose how you want to calibrate this instrument
          </p>
        </div>

        <div className="space-y-4">
          {/* In-House Option */}
          <div className={`w-full p-4 rounded-xl border-2 transition-all ${
            canUseInHouse 
              ? 'border-indigo-200 hover:border-indigo-400 cursor-pointer' 
              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
          }`}>
            <button
              onClick={canUseInHouse ? onSelectInHouse : undefined}
              disabled={isLoading || !canUseInHouse}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    canUseInHouse ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Home className={`h-5 w-5 ${
                      canUseInHouse ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h4 className={`font-semibold ${
                      canUseInHouse ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      In-House Calibration
                    </h4>
                    <p className={`text-sm ${
                      canUseInHouse ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Calibrate using internal equipment
                    </p>
                  </div>
                </div>
                {!canUseInHouse && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Not available
                  </span>
                )}
              </div>
              
              {/* Show machine details if available */}
              {canUseInHouse && machine && (
                <div className="ml-12 mt-2 p-2 bg-indigo-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-medium text-indigo-700">
                        Available Machine:
                      </span>
                    </div>
                    <div className="text-xs text-gray-700">
                      <div className="font-medium">{machine.machineName}</div>
                      {machine.gageTypeName && (
                        <div>Type: {machine.gageTypeName}</div>
                      )}
                      {machine.gageSubTypeName && (
                        <div>Sub-type: {machine.gageSubTypeName}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Out Service Option */}
          <button
            onClick={onSelectOutService}
            disabled={isLoading}
            className="w-full p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-semibold text-gray-900">
                Out Service Calibration
              </h4>
              <p className="text-sm text-gray-600">
                Send to external calibration service
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>

        {!canUseInHouse && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 mb-1">
                  In-house calibration not available
                </p>
                <p className="text-xs text-amber-600">
                  This instrument doesn't have an assigned calibration machine. 
                  Please assign a calibration machine in the instrument settings or 
                  use out-service calibration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalibrationTypeModal;