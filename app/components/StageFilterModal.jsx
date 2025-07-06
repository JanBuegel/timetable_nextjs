'use client';

import React from 'react';

export default function StageFilterModal({
  isOpen,
  onClose,
  uniqueStages,
  selectedStages,
  onStageToggle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 border border-gray-700">
        <h2 className="text-2xl font-stencil text-gray-100 mb-4 text-center">Filter by Stage</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {uniqueStages.map((stage) => (
            <button
              key={stage}
              className={`p-2 rounded-full text-center font-bold ${selectedStages.has(stage)
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-600 text-gray-200'
              }`}
              onClick={() => onStageToggle(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
        <button
          className="w-full p-3 rounded-full bg-gray-700 text-gray-100 font-bold text-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}