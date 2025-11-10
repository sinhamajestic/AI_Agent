import { Router } from 'express';
import { db, SIMULATED_USER_ID, getTodayDateRange } from '../utils/db.js';
import { Timestamp } from '@google-cloud/firestore';
import { TaskStatus } from '../../types.js';

export const dataRoutes = Router();

const tasksCollection = db.collection('tasks');
const summariesCollection = db.collection('summaries');
const integrationsCollection = db.collection('integrations');

/**
 * GET /api/kpis
 * Fetches the 3 KPI stats for the Dashboard.
 */
dataRoutes.get('/kpis', async (req, res) => {
  try {
    const now = Timestamp.now();
    const { start, end } = getTodayDateRange();

    const overduePromise = tasksCollection
      .where('userId', '==', SIMULATED_USER_ID)
      .where('dueAt', '<', now)
      .where('status', '!=', TaskStatus.Done)
      .count()
      .get();
      
    const dueTodayPromise = tasksCollection
      .where('userId', '==', SIMULATED_USER_ID)
      .where('dueAt', '>=', start)
      .where('dueAt', '<=', end)
      .where('status', '!=', TaskStatus.Done)
      .count()
      .get();

    // For "Incoming", we'll just show all 'todo' tasks for the demo
    const incomingPromise = tasksCollection
      .where('userId', '==', SIMULATED_USER_ID)
      .where('status', '==', TaskStatus.Todo)
      .count()
      .get();

    const [overdueSnapshot, dueTodaySnapshot, incomingSnapshot] = await Promise.all([
      overduePromise,
      dueTodayPromise,
      incomingPromise
    ]);

    res.status(200).send({
      overdue: overdueSnapshot.data().count,
      dueToday: dueTodaySnapshot.data().count,
      incoming: incomingSnapshot.data().count,
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).send({ error: 'Failed to fetch KPIs' });
  }
});

/**
 * GET /api/tasks
 * Fetches tasks based on filters. Powers Dashboard and Task Stream.
 */
dataRoutes.get('/tasks', async (req, res) => {
  const filter = req.query.filter as 'overdue' | 'due_today' | 'ingested';
  try {
    let query: FirebaseFirestore.Query = tasksCollection.where('userId', '==', SIMULATED_USER_ID);

    if (filter === 'overdue') {
      query = query
        .where('dueAt', '<', Timestamp.now())
        .where('status', '!=', TaskStatus.Done)
        .orderBy('dueAt', 'asc');
    } else if (filter === 'due_today') {
      const { start, end } = getTodayDateRange();
      query = query
        .where('dueAt', '>=', start)
        .where('dueAt', '<=', end)
        .where('status', '!=', TaskStatus.Done)
        .orderBy('dueAt', 'asc');
    } else {
      // 'ingested' or no filter
      query = query.orderBy('createdAt', 'desc');
    }

    const snapshot = await query.limit(50).get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(tasks);
  } catch (error) {
    console.error(`Error fetching tasks (filter: ${filter}):`, error);
    res.status(500).send({ error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/tasks/:id/action
 * Handles task actions from the UI (complete, snooze, block).
 */
dataRoutes.post('/tasks/:id/action', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const taskRef = tasksCollection.doc(id);

  try {
    let updateData: any = { updatedAt: new Date().toISOString() };

    if (action === 'complete') {
      updateData.status = TaskStatus.Done;
    } else if (action === 'snooze_1d') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      updateData.dueAt = tomorrow.toISOString();
    } else if (action === 'block') {
      updateData.status = TaskStatus.Blocked;
    } else {
      return res.status(400).send({ error: 'Invalid action' });
    }

    await taskRef.update(updateData);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(`Error processing action '${action}' for task ${id}:`, error);
    res.status(500).send({ error: 'Failed to update task' });
  }
});


/**
 * GET /api/summaries
 * Fetches all meeting and document summaries.
 */
dataRoutes.get('/summaries', async (req, res) => {
  try {
    const snapshot = await summariesCollection
      .where('userId', '==', SIMULATED_USER_ID)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
    const summaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).send({ error: 'Failed to fetch summaries' });
  }
});

/**
 * GET /api/settings/integrations
 * Fetches the list of integrations for the Settings page.
 */
dataRoutes.get('/settings/integrations', async (req, res) => {
    try {
        const snapshot = await integrationsCollection
            .where('userId', '==', SIMULATED_USER_ID)
            .get();
        
        if (snapshot.empty) {
             // Optional: Seed the integrations if they don't exist
            console.log('No integrations found for user, seeding...');
            // You could add seeding logic here for the demo
            return res.status(200).send([]);
        }

        const integrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(integrations);
    } catch (error) {
        console.error('Error fetching integrations:', error);
        res.status(500).send({ error: 'Failed to fetch integrations' });
    }
});


/**
 * POST /api/settings/sync
 * Triggered by the 'Sync Now' button. This simulates new data by
 * calling the internal 'taskhive-agents' service.
 */
dataRoutes.post('/settings/sync', async (req, res) => {
  // IMPORTANT: Replace this URL with your *internal* Cloud Run URL
  // for the 'taskhive-agents' service.
  // You can get this from the Cloud Run console (it ends in .a.run.app)
  // For local testing, it might be http://localhost:8081
  const agentServiceUrl = process.env.AGENT_SERVICE_URL || 'http://localhost:8081';

  try {
    // We send mock data to the agents to process.
    const mockEmail = {
      subject: "Final call: Action required for Q4 budget",
      body: "Hi team,\n\nPlease review the attached Q4 budget proposal and send your feedback to me by this Friday at 5pm. Also, don't forget the all-hands meeting next Monday.\n\nThanks"
    };
    
    const mockMeeting = {
      title: "Q4 Budget Review",
      transcript: "Alice: OK, let's start. The main point is the new marketing budget. Bob: I see it's increased by 20%. Alice: Yes, Bob, you need to finalize the vendor contracts by end-of-day. Carol: I'll draft the press release. Alice: Great. Carol, please send the draft to legal by tomorrow."
    };

    // Trigger the agents but DON'T wait for them to finish.
    // This makes the UI feel fast. The agents work in the background.
    fetch(`${agentServiceUrl}/process/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockEmail),
    }).catch(e => console.error('Failed to trigger email agent:', e.message));
    
    fetch(`${agentServiceUrl}/process/meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockMeeting),
    }).catch(e => console.error('Failed to trigger meeting agent:', e.message));

    // Respond to the frontend immediately
    res.status(202).send({ message: 'Sync triggered. New tasks will appear shortly.' });

  } catch (error) {
    console.error('Error triggering sync:', error);
    res.status(500).send({ error: 'Failed to trigger sync' });
  }
});