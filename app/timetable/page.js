

import fs from 'fs/promises';
import path from 'path';

// This function will run on the server to fetch and parse data
async function getTimetableData() {
  const csvPath = path.join(process.cwd(), 'app', 'data', 'open_flair_custom.csv');
  try {
    const csvData = await fs.readFile(csvPath, 'utf-8');
    
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(';');
    
    const events = lines.slice(1).map(line => {
      const values = line.split(';');
      // Clean up extra quotes and whitespace
      const cleanedValues = values.map(v => v.trim().replace(/^"+|"+$/g, ''));
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = cleanedValues[index] || '';
        return obj;
      }, {});
    });

    // Group events by date and then by stage
    const groupedEvents = events.reduce((acc, event) => {
      const { date, stage } = event;
      if (!date || !stage) return acc; // Skip entries with missing data
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][stage]) {
        acc[date][stage] = [];
      }
      acc[date][stage].push(event);
      return acc;
    }, {});

    // Sort events by time within each stage
    for (const date in groupedEvents) {
      for (const stage in groupedEvents[date]) {
        groupedEvents[date][stage].sort((a, b) => a.time.localeCompare(b.time));
      }
    }
    
    // Sort the dates for chronological order
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
        const partsA = a.split('.').map(Number);
        const partsB = b.split('.').map(Number);
        const dateA = new Date(partsA[2] > 99 ? partsA[2] : 2000 + partsA[2], partsA[1] - 1, partsA[0]);
        const dateB = new Date(partsB[2] > 99 ? partsB[2] : 2000 + partsB[2], partsB[1] - 1, partsB[0]);
        return dateA - dateB;
    });

    const sortedGroupedEvents = {};
    for (const date of sortedDates) {
        sortedGroupedEvents[date] = groupedEvents[date];
    }

    return sortedGroupedEvents;
  } catch (error) {
    console.error("Failed to read or parse timetable data:", error);
    return {}; // Return empty data on error to prevent crashing
  }
}

// The page is now an async component that fetches data before rendering
export default async function TimetablePage() {
  const groupedEvents = await getTimetableData();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Open Flair Timetable</h1>
      {Object.keys(groupedEvents).length === 0 ? (
        <p className="text-center text-red-500">Timetable data is currently unavailable or failed to load.</p>
      ) : (
        Object.entries(groupedEvents).map(([date, stages]) => (
          <div key={date} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gray-100 p-2 rounded-md sticky top-0">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stages).map(([stage, stageEvents]) => (
                <div key={stage} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-bold mb-2 text-center">{stage}</h3>
                  <ul className="divide-y divide-gray-200">
                    {stageEvents.map((event, index) => (
                      <li key={`${event.name}-${event.date}-${event.time}-${event.stage}`} className="py-2 flex">
                        <span className="font-bold w-16 flex-shrink-0">{event.time}</span>
                        <span>{event.name}</span>
                      </li>
                    ))
                  }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
