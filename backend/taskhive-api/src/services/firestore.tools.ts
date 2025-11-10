import { db, SIMULATED_USER_ID, getTodayDateRange } from '../utils/db.js';
// --- FIX: Corrected the import path ---
import { Task, TaskPriority, TaskStatus, Summary } from '../../../types.js';
import { Timestamp } from '@google-cloud/firestore';

// This file replaces the mock data from your SmartAgent.tsx
// It implements the *real* logic for the AI's tools.

const tasksCollection = db.collection('tasks');
const summariesCollection = db.collection('summaries');

/**
 * AI Tool: Gets a list of tasks based on a filter.
 */
export async function getTasks(status: 'overdue' | 'due_today' | 'all'): Promise<Task[]> {
  console.log(`[Tool] getTasks called with status: ${status}`);
  let query: FirebaseFirestore.Query = tasksCollection.where('userId', '==', SIMULATED_USER_ID);

  if (status === 'overdue') {
    query = query
      .where('dueAt', '<', Timestamp.now())
      .where('status', '!=', TaskStatus.Done);
  } else if (status === 'due_today') {
    const { start, end } = getTodayDateRange();
    query = query
      .where('dueAt', '>=', start)
      .where('dueAt', '<=', end)
      .where('status', '!=', TaskStatus.Done);
  }
  
  // --- FIX: Added orderBy for 'all' to satisfy Firestore ---
  if (status === 'all') {
    query = query.orderBy('createdAt', 'desc');
  } else {
    // 'overdue' and 'due_today' must be ordered by dueAt for the query to work
    query = query.orderBy('dueAt', 'asc');
  }

  const snapshot = await query.limit(20).get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
}

/**
 * AI Tool: Creates a new task.
 */
export async function createTask(args: { title: string, priority?: TaskPriority, dueDate?: string }): Promise<{ success: true, task: Task }> {
  console.log(`[Tool] createTask called with title: ${args.title}`);
  
  const newTask: Task = {
    userId: SIMULATED_USER_ID,
    title: args.title,
    description: '',
    status: TaskStatus.Todo,
    priority: args.priority || TaskPriority.Medium,
    dueAt: args.dueDate ? new Date(args.dueDate).toISOString() : null,
    source: {
      type: 'agent',
      origin: 'Smart Agent'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await tasksCollection.add(newTask);
  
  return { success: true, task: { id: docRef.id, ...newTask } };
}

/**
 * AI Tool: Gets a list of all summaries.
 */
export async function getSummaries(): Promise<Summary[]> {
  console.log(`[Tool] getSummaries called`);
  
  const snapshot = await summariesCollection
    .where('userId', '==', SIMULATED_USER_ID)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Summary));
}