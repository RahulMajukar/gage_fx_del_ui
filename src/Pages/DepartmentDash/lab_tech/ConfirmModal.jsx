// src/components/ConfirmModal.jsx
import { AlertCircle, CheckCircle, X, AlertTriangle, Info } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // 'default', 'danger', 'warning', 'success', 'info'
  isLoading = false,
  disableConfirm = false
}) => {
  if (!isOpen) return null;

  // Styling based on type
  const typeConfig = {
    default: {
      icon: <AlertCircle className="text-blue-600" size={24} />,
      confirmButton: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200"
    },
    danger: {
      icon: <X className="text-red-600" size={24} />,
      confirmButton: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-200"
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-600" size={24} />,
      confirmButton: "bg-yellow-600 hover:bg-yellow-700",
      borderColor: "border-yellow-200"
    },
    success: {
      icon: <CheckCircle className="text-green-600" size={24} />,
      confirmButton: "bg-green-600 hover:bg-green-700",
      borderColor: "border-green-200"
    },
    info: {
      icon: <Info className="text-blue-600" size={24} />,
      confirmButton: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200"
    }
  };

  const config = typeConfig[type] || typeConfig.default;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-auto border ${config.borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {config.icon}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-line">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || disableConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${config.confirmButton}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;