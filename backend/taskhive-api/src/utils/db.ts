import { Firestore, Timestamp } from '@google-cloud/firestore';
import { Task, TaskPriority, TaskStatus } from '../../types.js';

// Initialize Firestore
export const db = new Firestore();

// --- HARDCODED USER ID ---
// As requested, we'll use a simulated user for the hackathon
export const SIMULATED_USER_ID = 'demo-user-12345';

// Helper function to get today's date range
export const getTodayDateRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
};