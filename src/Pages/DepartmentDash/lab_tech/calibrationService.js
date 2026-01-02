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