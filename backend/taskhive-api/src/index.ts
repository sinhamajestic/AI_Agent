import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { agentRoutes } from './routes/agent.routes.js';
import { dataRoutes } from './routes/data.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
// Enable CORS for your React frontend (update origin in production)
app.use(cors({ origin: '*' })); 
app.use(express.json());

// --- API Routes ---
app.use('/api', dataRoutes);
app.use('/api/agent', agentRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('TaskHive API is running!');
});

app.listen(port, () => {
  console.log(`[taskhive-api] Server listening on port ${port}`);
});