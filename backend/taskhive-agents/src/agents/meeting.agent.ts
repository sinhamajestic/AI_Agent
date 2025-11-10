import { GoogleGenerativeAI, FunctionDeclaration, GenerativeModel, Tool, defineAgent } from '@google/generative-ai/server';
import { createTaskInFirestore, createSummaryInFirestore } from '../tools/firestore.tools.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Use the "smart" model for summarization
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); 

// 1. Define the tools the Meeting Agent can use
const tools: Tool[] = [{
  functionDeclarations: [
    {
      name: 'saveMeetingSummaryAndTasks',
      description: 'Saves the meeting summary and all extracted action items to Firestore.',
      parameters: {
        type: 'OBJECT',
        properties: {
          summaryContent: { type: 'STRING', description: 'A concise executive summary of the meeting.' },
          actionItems: {
            type: 'ARRAY',
            description: 'A list of action items (tasks) extracted from the meeting.',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING', description: 'The title of the task.' },
                priority: { type: 'STRING', description: 'Priority: "low", "medium", "high", or "critical".' },
                dueDate: { type: 'STRING', description: 'The due date in ISO 8601 format, if mentioned.' },
              },
              required: ['title']
            }
          }
        },
        required: ['summaryContent', 'actionItems']
      },
    },
  ],
}];

// 2. Define the agent
export const meetingAgent = defineAgent({
  model,
  tools,
  systemInstruction: `You are a Meeting Intelligence Agent. Your job is to read a meeting transcript and do two things:
  1. Write a brief, professional executive summary.
  2. Extract ALL action items, assigning priority and due dates if mentioned.
  - Today's date is: ${new Date().toISOString()}
  - When you are finished, call 'saveMeetingSummaryAndTasks' with the summary and the list of action items.`,
});

// 3. Define the function to run the agent
export async function runMeetingAgent(transcript: string, meetingTitle: string) {
  console.log(`[MeetingAgent] Processing transcript for: ${meetingTitle}`);

  const { conversation } = await meetingAgent.startChat();
  const { text, toolUse } = await conversation.sendMessage(transcript);

  if (toolUse && toolUse.name === 'saveMeetingSummaryAndTasks') {
    const { summaryContent, actionItems } = toolUse.args as { summaryContent: string, actionItems: any[] };

    // 1. Save the summary
    await createSummaryInFirestore({
      title: meetingTitle,
      summaryContent: summaryContent,
      actionItems: actionItems.map(task => task.title), // Save just the titles in the summary
      sourceType: 'meeting',
      sourceOrigin: meetingTitle
    });

    // 2. Create tasks for each action item
    const tasksWithSource = actionItems.map(task => ({
      ...task,
      sourceType: 'meeting',
      sourceOrigin: meetingTitle
    }));

    for (const task of tasksWithSource) {
      await createTaskInFirestore(task);
    }
    
    console.log(`[MeetingAgent] Summary and ${actionItems.length} tasks created.`);
    return `Summary and ${actionItems.length} tasks created.`;
  }

  return text || "No action taken.";
}