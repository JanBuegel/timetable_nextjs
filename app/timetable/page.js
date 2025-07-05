
'use client';

import { useState, useEffect } from 'react';

export default function TimetablePage() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [allStages, setAllStages] = useState([]);
  const [allDates, setAllDates] = useState([]);

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
        setAllDates(Object.keys(data));
        const stages = new Set();
        Object.values(data).forEach((s) => {
          Object.keys(s).forEach((st) => stages.add(st));
        });
        setAllStages(Array.from(stages));
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

  const toggleStage = (stage) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  };

  const toggleDate = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  if (loading) {
    return <p className="text-center text-white">Loading timetable...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading timetable: {error}</p>;
  }

  return (
    <>
      {filterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg max-w-sm w-full space-y-4">
            <h2 className="text-xl font-bold">Filtern</h2>
            <div>
              <h3 className="font-semibold mb-2">Bühnen</h3>
              <div className="flex flex-wrap gap-2">
                {allStages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => toggleStage(stage)}
                    className={`px-2 py-1 rounded-full border transition-colors ${selectedStages.includes(stage) ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tage</h3>
              <div className="flex flex-wrap gap-2">
                {allDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDate(d)}
                    className={`px-2 py-1 rounded-full border transition-colors ${selectedDates.includes(d) ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right space-x-2">
              <button
                onClick={() => { setSelectedStages([]); setSelectedDates([]); }}
                className="px-2 py-1 rounded border"
              >
                Zurücksetzen
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-2 py-1 rounded bg-blue-500 text-white"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Open Flair Timetable</h1>
      {Object.keys(groupedEvents).length === 0 ? (
        <p className="text-center text-red-500">Timetable data is currently unavailable or failed to load.</p>
      ) : (
        Object.entries(groupedEvents)
          .filter(([date]) =>
            selectedDates.length === 0 || selectedDates.includes(date)
          )
          .map(([date, stages]) => (
            <div key={date} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 bg-gray-100 p-2 rounded-md sticky top-0">{date}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stages)
                  .filter(([stage]) =>
                    selectedStages.length === 0 || selectedStages.includes(stage)
                  )
                  .map(([stage, stageEvents]) => {
                    const eventsFiltered = stageEvents.filter((event) => {
                      const eventKey = `${event.name}-${event.date}-${event.time}-${event.stage}`;
                      const isFav = favorites[eventKey];
                      return (
                        (!showFavoritesOnly || isFav)
                      );
                    });
                    if (eventsFiltered.length === 0) return null;
                    return (
                      <div key={stage} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-xl font-bold mb-2 text-center">{stage}</h3>
                        <ul className="divide-y divide-gray-200">
                          {eventsFiltered.map((event) => {
                            const eventKey = `${event.name}-${event.date}-${event.time}-${event.stage}`;
                            const isFavorite = favorites[eventKey];
                            return (
                              <li key={eventKey} className="py-2 flex items-center gap-2">
                                <span className="w-16 font-bold flex-shrink-0">{event.time}</span>
                                <span className="flex-grow">{event.name}</span>
                                <button
                                  onClick={() => toggleFavorite(event)}
                                  className="w-8 h-8 flex items-center justify-center text-red-500 rounded-full focus:outline-none"
                                >
                                  {isFavorite ? '♥' : '♡'}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
      )}
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
        {menuOpen && (
          <>
            <button
              className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              {showFavoritesOnly ? '❤️' : '🤍'}
            </button>
            <button
              className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
              onClick={() => { setFilterModalOpen(true); setMenuOpen(false); }}
            >
              🔍
            </button>
          </>

        )}
        <button
          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </div>
    </>
  );
}
