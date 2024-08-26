import React from 'react';
import { TravelOption } from '../types';
import { travelOptions } from '../constants';

const TravelOptions: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-5xl mx-auto">
    {travelOptions.map((option: TravelOption, index: number) => (
      <div key={index} className="border border-white p-4 text-center hover:bg-white hover:text-black transition cursor-pointer">
        {option.icon}
        <h3 className="mt-2 text-sm">{option.title}</h3>
      </div>
    ))}
  </div>
);

export default TravelOptions;