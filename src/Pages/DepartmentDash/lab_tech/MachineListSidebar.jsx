import React, { useState, useEffect } from "react";
import { X, Package, Database, AlertTriangle, CheckCircle } from "lucide-react";

function MachineListSidebar({ isOpen, onClose }) {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMachines();
    }
  }, [isOpen]);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/inhouse-calibration-machines/all");
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

  if (!isOpen) return null;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'inactive':
      case 'maintenance':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <Database size={16} className="text-gray-400" />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package size={20} />
            Available Instruments
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Database className="animate-spin mb-2" size={32} />
              Loading instruments...
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-md">
              {error}
            </div>
          ) : machines.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No instruments found.
            </div>
          ) : (
            <div className="space-y-4">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{machine.machineName}</h3>
                      <p className="text-sm text-gray-600">{machine.instrumentName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono">{machine.instrumentCode}</span>
                      </p>
                    </div>
                    <span className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                      {getStatusIcon(machine.status)}
                      <span className="ml-1">{machine.status}</span>
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {machine.gageTypeName}
                    </div>
                    <div>
                      <span className="font-medium">Subtype:</span>{" "}
                      {machine.gageSubTypeName}
                    </div>
                    <div>
                      <span className="font-medium">Accuracy:</span>{" "}
                      {machine.accuracy}
                    </div>
                    <div>
                      <span className="font-medium">Resolution:</span>{" "}
                      {machine.resolution}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>{" "}
                      {machine.location}
                    </div>
                    <div>
                      <span className="font-medium">Manufacturer:</span>{" "}
                      {machine.manufacturer}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Guarantee Expires:</span>{" "}
                      {new Date(machine.guaranteeExpiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (optional) */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          {machines.length} instruments loaded
        </div>
      </div>
    </>
  );
}

export default MachineListSidebar;