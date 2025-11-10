import React, { useState, useEffect } from 'react';
import MeetingCard from './MeetingCard';
import type { Summary } from '../types';

const API_URL = 'http://localhost:8080/api';

const Meetings: React.FC = () => {
  const [meetingSummaries, setMeetingSummaries] = useState<Summary[]>([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await fetch(`${API_URL}/summaries`);
        if (!response.ok) throw new Error('Failed to fetch summaries');
        const data: Summary[] = await response.json();
        // Filter for meetings, just in case
        setMeetingSummaries(data.filter(s => s.type === 'meeting'));
      } catch (error) {
        console.error('Error fetching summaries:', error);
      }
    };

    fetchSummaries();
     // Also auto-refresh
    const intervalId = setInterval(fetchSummaries, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetingSummaries.length > 0 ? (
          meetingSummaries.map(summary => (
            <MeetingCard key={summary.id} summary={summary} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-16">No meeting summaries found. Try the 'Sync Now' button in Settings!</p>
        )}
      </div>
    </div>
  );
};

export default Meetings;