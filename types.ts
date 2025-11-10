
export type Page = 'dashboard' | 'stream' | 'inbox' | 'meetings' | 'settings';

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
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string;
  source: {
    type: 'email' | 'meeting' | 'document' | 'slack';
    origin: string;
  };
}

export interface Summary {
  id: string;
  type: 'meeting' | 'document';
  title: string;
  content: string;
  createdAt: string;
}

export interface Integration {
  id: 'gmail' | 'slack' | 'notion' | 'trello' | 'jira';
  name: string;
  enabled: boolean;
}
