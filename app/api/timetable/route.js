import { NextResponse } from 'next/server';
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

export async function GET() {
  const data = await getTimetableData();
  return NextResponse.json(data);
}