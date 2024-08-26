import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface TravelerCounterProps {
  travelers: number;
  onTravelerChange: (increment: number) => void;
}

const TravelerCounter: React.FC<TravelerCounterProps> = ({ travelers, onTravelerChange }) => (
  <>
    <button onClick={(e) => { e.stopPropagation(); onTravelerChange(-1); }} className="ml-2 p-1">
      <Minus className="w-4 h-4" />
    </button>
    <span className="mx-2">{travelers}</span>
    <button onClick={(e) => { e.stopPropagation(); onTravelerChange(1); }} className="p-1">
      <Plus className="w-4 h-4" />
    </button>
  </>
);

export default TravelerCounter;