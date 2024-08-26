import React from 'react';
import { activityOptions } from '../constants';

interface ActivitySelectorProps {
  selectedActivities: string[];
  onActivityToggle: (activity: string) => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({ selectedActivities, onActivityToggle }) => (
  <div className="mt-4 bg-gray-900 p-4 rounded-lg">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {activityOptions.map(activity => (
        <button
          key={activity}
          onClick={() => onActivityToggle(activity)}
          className={`px-3 py-2 text-sm ${
            selectedActivities.includes(activity) ? 'bg-white text-black' : 'bg-gray-800'
          } rounded`}
        >
          {activity}
        </button>
      ))}
    </div>
  </div>
);

export default ActivitySelector;