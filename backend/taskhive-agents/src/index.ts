import express from 'express';
import dotenv from 'dotenv';
import { agentTriggerRoutes } from './trigger.routes.js';

dotenv.config();

const app = express();
// This service runs on a different port (e.g., 8081)
const port = process.env.PORT || 8081; 

app.use(express.json());

// --- Agent Trigger Routes ---
app.use('/', agentTriggerRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('TaskHive Agents service is running!');
});

app.listen(port, () => {
  console.log(`[taskhive-agents] Server listening on port ${port}`);
});