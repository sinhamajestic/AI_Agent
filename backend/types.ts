// This file can be shared or copied between your services

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Blocked = 'blocked',
  Done = 'done',
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export interface Task {
  id?: string; // Firestore will generate this
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null; // Store as ISO string
  source: {
    type: 'email' | 'meeting' | 'document' | 'slack' | 'agent' | 'manual';
    origin: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  id?: string; // Firestore will generate this
  userId: string;
  type: 'meeting' | 'document';
  title: string;
  content: string; // The summary text
  actionItems: string[]; // List of extracted action items
  sourceOrigin: string;
  createdAt: string;
}