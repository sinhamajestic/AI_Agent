import { db, SIMULATED_USER_ID } from '../utils/db.js';
import { Task, Summary, TaskPriority, TaskStatus } from '../../types.js';

const tasksCollection = db.collection('tasks');
const summariesCollection = db.collection('summaries');

/**
 * ADK Tool: Creates a new task in Firestore.
 */
export async function createTaskInFirestore(args: { 
  title: string, 
  priority?: TaskPriority, 
  dueDate?: string, 
  sourceType: Task['source']['type'],
  sourceOrigin: string 
}): Promise<string> {
  console.log(`[ADK Tool] createTaskInFirestore called: ${args.title}`);
  
  const newTask: Task = {
    userId: SIMULATED_USER_ID,
    title: args.title,
    description: '',
    status: TaskStatus.Todo,
    priority: args.priority || TaskPriority.Medium,
    dueAt: args.dueDate ? new Date(args.dueDate).toISOString() : null,
    source: {
      type: args.sourceType,
      origin: args.sourceOrigin
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await tasksCollection.add(newTask);
  return `Task created successfully with ID: ${docRef.id}`;
}

/**
 * ADK Tool: Creates a new summary in Firestore.
 */
export async function createSummaryInFirestore(args: {
  title: string,
  summaryContent: string,
  actionItems: string[],
  sourceType: Summary['type'],
  sourceOrigin: string
}): Promise<string> {
   console.log(`[ADK Tool] createSummaryInFirestore called: ${args.title}`);

   const newSummary: Summary = {
    userId: SIMULATED_USER_ID,
    type: args.sourceType,
    title: args.title,
    content: args.summaryContent,
    actionItems: args.actionItems,
    sourceOrigin: args.sourceOrigin,
    createdAt: new Date().toISOString()
   };
   
   const docRef = await summariesCollection.add(newSummary);
   return `Summary created successfully with ID: ${docRef.id}`;
}