
import React from 'react';
import MeetingCard from './MeetingCard';
import type { Summary } from '../types';

const meetingSummaries: Summary[] = [
  {
    id: '1',
    type: 'meeting',
    title: 'Q3 Planning Session',
    createdAt: '2024-07-21T14:00:00Z',
    content: 'Executive summary: Discussed roadmap for the next quarter. Key decisions include focusing on feature X and postponing Y. Action items assigned to Alice (dev), Bob (QA), and Carol (docs).'
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Client Kick-off: Project Phoenix',
    createdAt: '2024-07-19T10:00:00Z',
    content: 'Introduced the teams and aligned on project goals. Client emphasized the need for weekly check-ins. Open questions around API rate limits need to be addressed by the engineering team before next sync.'
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Weekly Engineering Sync',
    createdAt: '2024-07-18T16:00:00Z',
    content: 'Team provided updates on current sprints. Blocker identified in the payments module. John to investigate and report back by EOD tomorrow. No other major decisions made.'
  },
   {
    id: '4',
    type: 'document',
    title: 'Doc Review: Annual Report 2024',
    createdAt: '2024-07-15T11:00:00Z',
    content: 'Summarized the annual financial report. Key takeaways include a 15% YoY growth and expansion into new markets. Obligation for the finance team to submit final figures by end of month.'
  }
];

const Meetings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetingSummaries.map(summary => (
          <MeetingCard key={summary.id} summary={summary} />
        ))}
      </div>
    </div>
  );
};

export default Meetings;
