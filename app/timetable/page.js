
'use client';

import { useState, useEffect } from 'react';

export default function TimetablePage() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // Fetch data from the API route
    const fetchTimetable = async () => {
      try {
        const response = await fetch('/api/timetable');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGroupedEvents(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();

    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem('openFlairFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage whenever they change
    localStorage.setItem('openFlairFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (event) => {
    const eventKey = `${event.name}-${event.date}-${event.time}-${event.stage}`;
    setFavorites(prevFavorites => ({
      ...prevFavorites,
      [eventKey]: !prevFavorites[eventKey]
    }));
  };

  if (loading) {
    return <p className="text-center text-white">Loading timetable...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading timetable: {error}</p>;
  }

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
                    {stageEvents.map((event) => {
                      const eventKey = `${event.name}-${event.date}-${event.time}-${event.stage}`;
                      const isFavorite = favorites[eventKey];
                      return (
                        <li key={eventKey} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold w-16 flex-shrink-0">{event.time}</span>
                            <span>{event.name}</span>
                          </div>
                          <button
                            onClick={() => toggleFavorite(event)}
                            className="ml-2 p-1 rounded-full focus:outline-none"
                          >
                            {isFavorite ? '★' : '☆'}
                          </button>
                        </li>
                      );
                    })}
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
