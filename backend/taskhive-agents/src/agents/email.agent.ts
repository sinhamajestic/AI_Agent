import { GoogleGenerativeAI, FunctionDeclaration, GenerativeModel, Tool, defineAgent, FunctionDeclarationSchemaType } from '@google/generative-ai/server';
import { createTaskInFirestore } from '../tools/firestore.tools.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// 1. Define the tool the Email Agent can use
const tools: Tool[] = [{
  functionDeclarations: [
    {
      name: 'createTaskInFirestore',
      description: 'Creates one or more new tasks in the user\'s Firestore database.',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT, // <--- FIX
        properties: {
          tasks: {
            type: FunctionDeclarationSchemaType.ARRAY, // <--- FIX
            description: 'A list of tasks to create.',
            items: {
              type: FunctionDeclarationSchemaType.OBJECT, // <--- FIX
              properties: {
                title: { type: FunctionDeclarationSchemaType.STRING, description: 'The title of the task.' }, // <--- FIX
                priority: { type: FunctionDeclarationSchemaType.STRING, description: 'Priority: "low", "medium", "high", or "critical". Infer based on urgency.' }, // <--- FIX
                dueDate: { type: FunctionDeclarationSchemaType.STRING, description: 'The due date in ISO 8601 format. e.g., 2025-11-12T17:00:00Z. Must be a future date.' }, // <--- FIX
              },
              required: ['title']
            }
          }
        },
        required: ['tasks']
      },
    },
  ],
}];

// 2. Define the agent
export const emailAgent = defineAgent({
  model,
  tools,
  systemInstruction: `You are an Email Intelligence Agent. Your job is to read an email and extract all action items as tasks.
  - Today's date is: ${new Date().toISOString()}
  - Be precise. Extract all distinct tasks.
  - Infer priority (low, medium, high, critical) based on keywords (e.g., "ASAP" is critical, "by Friday" is high).
  - Convert relative dates (e.g., "this Friday", "next Monday") into absolute ISO 8601 timestamps.
  - When you have the list of tasks, call the 'createTaskInFirestore' function ONE TIME with all tasks in the array.`,
});

// 3. Define the function to run the agent
export async function runEmailAgent(emailBody: string, emailSubject: string, emailFrom: string) {
  console.log(`[EmailAgent] Processing email from: ${emailFrom}`);
  
  const context = `From: ${emailFrom}\nSubject: ${emailSubject}\n\nBody:\n${emailBody}`;
  const { conversation } = await emailAgent.startChat();

  const { text, toolUse } = await conversation.sendMessage(context);

  if (toolUse && toolUse.name === 'createTaskInFirestore') {
    const { tasks } = toolUse.args as { tasks: any[] };
    
    // Add the source to each task before saving
    const tasksWithSource = tasks.map(task => ({
      ...task,
      sourceType: 'email',
      sourceOrigin: emailFrom
    }));

    // In a real app, you might want to call the tool for each task
    // But for the ADK, we'll batch it
    for (const task of tasksWithSource) {
      await createTaskInFirestore(task);
    }
    console.log(`[EmailAgent] ${tasks.length} tasks created from email.`);
    return `Created ${tasks.length} tasks.`;
  }

  return text || "No action taken.";
}