import { Router } from 'express';
import { runAgentChat } from '../services/gemini.service.js';

export const agentRoutes = Router();

/**
 * POST /api/agent/chat
 * This is the new backend for your SmartAgent.tsx component.
 */
agentRoutes.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    const responseText = await runAgentChat(prompt);
    res.status(200).send({ role: 'model', text: responseText });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).send({ error: 'Failed to get response from agent' });
  }
});