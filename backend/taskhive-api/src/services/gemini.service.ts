import {
  GoogleGenerativeAI,
  FunctionDeclaration,
  GenerativeModel,
  Tool,
  ChatSession,
  Content,
  FunctionDeclarationSchemaType, // <--- FIX 1: Import the enum
  GenerateContentResult
} from '@google/generative-ai';
import { getTasks, createTask, getSummaries } from './firestore.tools.js';

// --- This is the "lift and shift" of your SmartAgent.tsx logic ---

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 1. Define the functions the AI can call
const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'getTasks',
    description: "Get a list of the user's tasks based on a status filter.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT, // <--- FIX 2: Use the enum
      properties: {
        status: {
          type: FunctionDeclarationSchemaType.STRING, // <--- FIX 3: Use the enum
          description: 'The status to filter tasks by. Can be "overdue", "due_today", or "all".',
          enum: ['overdue', 'due_today', 'all'],
        },
      },
      required: ['status'],
    },
  },
  {
    name: 'createTask',
    description: 'Create a new task for the user.',
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT, // <--- FIX 4: Use the enum
      properties: {
        title: { type: FunctionDeclarationSchemaType.STRING, description: 'The title of the task.' }, // <--- FIX 5
        priority: { type: FunctionDeclarationSchemaType.STRING, description: 'The priority of the task. Can be "low", "medium", "high", or "critical".', enum: ['low', 'medium', 'high', 'critical'] }, // <--- FIX 6
        dueDate: { type: FunctionDeclarationSchemaType.STRING, description: 'The due date of the task in ISO 8601 format. e.g., 2025-11-12T10:00:00Z' }, // <--- FIX 7
      },
      required: ['title'],
    },
  },
  {
    name: 'getSummaries',
    description: 'Get a list of all meeting and document summaries.',
    parameters: { type: FunctionDeclarationSchemaType.OBJECT, properties: {} } // <--- FIX 8
  }
];

// 2. Define the tool implementations
const tools: Record<string, Function> = {
  getTasks,
  createTask,
  getSummaries,
};

// 3. Setup the model and chat
const model: GenerativeModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  tools: [{ functionDeclarations }],
});

const chatHistory: Content[] = [
  {
    role: 'user',
    parts: [{ text: "You are TaskHive, a helpful and friendly assistant for managing tasks. Be concise. Today's date is " + new Date().toLocaleDateString() }],
  },
  {
    role: 'model',
    parts: [{ text: "Hello! I'm your personal assistant. How can I help you manage your tasks today? You can ask things like 'What are my overdue tasks?' or 'Create a task to finish the report by tomorrow with high priority'." }],
  }
]

// For a simple demo, we use a single global chat session.
// In a real app, you'd manage one session per user.
const chat: ChatSession = model.startChat({
  history: chatHistory
});

/**
 * Runs the Gemini chat loop with function calling.
 * This is the core logic from your SmartAgent.tsx, now on the backend.
 * * --- FIX 9: This entire function is rewritten to be typesafe ---
 */
export async function runAgentChat(prompt: string): Promise<string> {
  try {
    let result: GenerateContentResult = await chat.sendMessage(prompt);

    while (true) {
      const response = result.response;
      const candidate = response.candidates?.[0];

      if (!candidate) {
        return "No response candidate found.";
      }

      // Check for function calls
      const functionCalls = candidate.content?.parts
        .filter(part => !!part.functionCall)
        .map(part => part.functionCall);

      if (!functionCalls || functionCalls.length === 0) {
        // No function call, get and return the text
        const text = candidate.content?.parts
          .filter(part => !!part.text)
          .map(part => part.text)
          .join('') || "I'm not sure how to help with that.";
        return text;
      }

      // Handle function calls
      console.log(`[Gemini] Function call(s) requested: ${functionCalls.map(fc => fc?.name).join(', ')}`);
      const functionResponses = [];

      for (const call of functionCalls) {
        if (!call) continue;
        const tool = tools[call.name];
        if (tool) {
          const toolResult = await tool(call.args);
          functionResponses.push({
            name: call.name,
            response: { result: toolResult },
          });
        }
      }

      // Send the function responses back to the model
      result = await chat.sendMessage(JSON.stringify(functionResponses)); // Re-assign the new GenerateContentResult
    }
  } catch (error) {
    console.error('Error in Gemini chat loop:', error);
    return 'Sorry, something went wrong on my end. Please try again.';
  }
}