import { Router } from 'express';
import { runEmailAgent } from './agents/email.agent.js';
import { runMeetingAgent } from './agents/meeting.agent.js';

export const agentTriggerRoutes = Router();

/**
 * POST /process/email
 * Internal endpoint triggered by taskhive-api to run the email agent.
 */
agentTriggerRoutes.post('/process/email', async (req, res) => {
  const { subject, body } = req.body;
  const emailFrom = req.body.from || 'demo-sender@example.com';

  if (!subject || !body) {
    return res.status(400).send({ error: 'Missing subject or body' });
  }

  try {
    // We don't await this. Let it run in the background.
    runEmailAgent(body, subject, emailFrom)
      .then(result => console.log(result))
      .catch(e => console.error('Email Agent Error:', e));

    // Respond immediately
    res.status(202).send({ message: 'Email agent processing started' });
  } catch (error) {
    console.error('Error triggering email agent:', error);
    res.status(500).send({ error: 'Failed to trigger email agent' });
  }
});

/**
 * POST /process/meeting
 * Internal endpoint triggered by taskhive-api to run the meeting agent.
 */
agentTriggerRoutes.post('/process/meeting', async (req, res) => {
  const { title, transcript } = req.body;

  if (!title || !transcript) {
    return res.status(400).send({ error: 'Missing title or transcript' });
  }

  try {
    // We don't await this.
    runMeetingAgent(transcript, title)
      .then(result => console.log(result))
      .catch(e => console.error('Meeting Agent Error:', e));
    
    // Respond immediately
    res.status(202).send({ message: 'Meeting agent processing started' });
  } catch (error) {
    console.error('Error triggering meeting agent:', error);
    res.status(500).send({ error: 'Failed to trigger meeting agent' });
  }
});