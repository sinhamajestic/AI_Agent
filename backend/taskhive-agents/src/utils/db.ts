import { Firestore } from '@google-cloud/firestore';

// Initialize Firestore
export const db = new Firestore();

// --- HARDCODED USER ID ---
// As requested, we'll use a simulated user for the hackathon
export const SIMULATED_USER_ID = 'demo-user-12345';