// src/services/calibrationService.js
// This file talks to the backend API

const API_BASE_URL = 'http://localhost:8080/api';

// Helper to get headers with token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Get all gages from API
export const fetchAllGages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/gages`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch gages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching gages:', error);
    throw error;
  }
};

// Get gages with a specific status
export const fetchGagesByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gages/status/${status}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch gages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching gages:', error);
    throw error;
  }
};

// Get gages that need calibration (our "scheduled" gages)
export const fetchGagesNeedingCalibration = async () => {
  try {
    const allGages = await fetchAllGages();
    
    // Filter for gages that need calibration soon
    const today = new Date();
    const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return allGages.filter(gage => {
      // Check if calibration is due soon or pending
      const nextCalibration = new Date(gage.nextCalibrationDate);
      const pendingCalibration = gage.pendingCalibrationDate ? new Date(gage.pendingCalibrationDate) : null;
      
      return (
        (nextCalibration <= twoWeeksFromNow && nextCalibration >= today) ||
        (pendingCalibration && pendingCalibration >= today)
      );
    });
  } catch (error) {
    console.error('Error fetching gages needing calibration:', error);
    throw error;
  }
};

// Get all calibration machines
export const fetchCalibrationMachines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/inhouse-calibration-machines/all`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch machines');
    return await response.json();
  } catch (error) {
    console.error('Error fetching calibration machines:', error);
    throw error;
  }
};

// Get gages for a specific machine
export const fetchGagesForMachine = async (machineId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gages/by-machine/${machineId}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch gages for machine');
    return await response.json();
  } catch (error) {
    console.error('Error fetching gages for machine:', error);
    throw error;
  }
};

// Update a gage's status
export const updateGageStatus = async (gageId, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gages/${gageId}/status?status=${newStatus}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to update gage status');
    return await response.json();
  } catch (error) {
    console.error('Error updating gage status:', error);
    throw error;
  }
};

// Helper: Convert API gage to scheduled gage format
export const apiGageToScheduled = (gage) => ({
  id: gage.id,
  gageId: gage.serialNumber || `GAGE-${gage.id}`,
  name: gage.gageType?.name || 'Unknown Gage',
  type: gage.gageSubType?.name || 'Dimensional',
  instrumentRequired: gage.inhouseCalibrationMachine?.machineName || 'Standard Calibrator',
  instrumentId: gage.inhouseCalibrationMachine?.instrumentCode || `INST-${gage.inhouseCalibrationMachine?.id || '001'}`,
  calibrationType: gage.inhouseCalibrationMachine ? 'inhouse' : 'external',
  scheduledDate: gage.pendingCalibrationDate || gage.nextCalibrationDate || '2024-01-25',
  dueDate: gage.nextCalibrationDate || '2024-02-25',
  priority: getPriority(gage.criticality),
  status: 'scheduled',
  location: gage.location || 'LAB',
  requestedBy: 'System',
  requestDate: new Date().toISOString().split('T')[0],
  technician: null,
  originalGage: gage
});

// Helper: Get priority from criticality
const getPriority = (criticality) => {
  switch (criticality) {
    case 'HIGH': return 'High';
    case 'MEDIUM': return 'Medium';
    case 'LOW': return 'Low';
    default: return 'Medium';
  }
};

// Helper: Get status badge
export const getStatusBadge = (status) => {
  const statusMap = {
    'ACTIVE': { color: 'bg-green-100 text-green-800', icon: '✓', text: 'Active' },
    'SCHEDULED': { color: 'bg-blue-100 text-blue-800', icon: '📅', text: 'Scheduled' },
    'IN_USE': { color: 'bg-yellow-100 text-yellow-800', icon: '⚡', text: 'In Use' },
    'MAINTENANCE': { color: 'bg-red-100 text-red-800', icon: '🔧', text: 'Maintenance' }
  };
  
  const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: '?', text: status };
  return config;
};


// Create calibration history record
export const createCalibrationLabTechHistory = async (calibrationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calibration-manager/lab-calibration-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(calibrationData),
    });
    
    if (!response.ok) throw new Error('Failed to create calibration history');
    return await response.json();
  } catch (error) {
    console.error('Error creating calibration history:', error);
    throw error;
  }
};

// Get calibration history by gage ID
export const getCalibrationHistoryByGage = async (gageId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calibration-manager/lab-calibration-history/gage/${gageId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch calibration history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching calibration history:', error);
    throw error;
  }
};

// Helper function to prepare data for your API
export const prepareCalibrationData = (gage, formData, user, machine) => {
  // Calculate calibration duration (assuming it started 2 hours ago)
  const startedAt = new Date();
  startedAt.setHours(startedAt.getHours() - 2);
  const completedAt = new Date();
  const durationInHours = (completedAt - startedAt) / (1000 * 60 * 60);
  
  // Map result values to match your backend enum
  const resultMap = {
    'PASS': 'PASSED',
    'FAIL': 'FAILED',
    'ADJUSTED': 'ADJUSTED',
    'OUT_OF_TOLERANCE': 'OUT_OF_TOLERANCE',
    'OBSOLETE': 'OBSOLETE'
  };
  
  return {
    gage: {
      id: gage.originalGage?.id || gage.id
    },
    technician: user?.name || formData.calibratedBy || 'Technician',
    calibrationDate: formData.calibrationDate,
    nextCalibrationDate: formData.nextCalibrationDate,
    result: resultMap[formData.result] || 'PASSED',
    remarks: formData.remarks,
    calibratedBy: formData.calibratedBy,
    certificateNumber: formData.certificateNumber,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    calibrationDuration: parseFloat(durationInHours.toFixed(2)),
    calibrationMachine: machine ? {
      id: machine.id
    } : null
  };
};

// Add to your calibrationService.js
// Get all completed calibrations from API
export const fetchCompletedCalibrations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/calibration-manager/lab-calibration-history`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch completed calibrations');
    const data = await response.json();
    
    // Extract data array from response
    return data.data || [];
  } catch (error) {
    console.error('Error fetching completed calibrations:', error);
    throw error;
  }
};

// Get gage details for a specific gage ID
export const fetchGageDetails = async (gageId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/gages/${gageId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch gage details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching gage details:', error);
    return null;
  }
};

// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};