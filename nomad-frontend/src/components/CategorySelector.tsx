import React from 'react';
import { Category } from '../types';
import { categories } from '../constants';
import TravelerCounter from './TravelerCounter';

interface CategorySelectorProps {
  onCategoryClick: (category: string) => void;
  openCategory: string | null;
  travelers: number;
  onTravelerChange: (increment: number) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategoryClick,
  openCategory,
  travelers,
  onTravelerChange
}) => (
  <div className="flex flex-wrap justify-center gap-2">
    {categories.map((category: Category) => (
    <button
        key={category.name}
        onClick={() => onCategoryClick(category.name)}
        className="px-3 py-2 bg-gray-900 text-sm hover:bg-gray-800 focus:outline-none flex items-center"
    >
        {<category.icon className="w-5 h-5" />}
        <span className="ml-2">{category.name}</span>
        {category.name === 'Travelers' && (
          <TravelerCounter
            travelers={travelers}
            onTravelerChange={onTravelerChange}
          />
        )}
      </button>
    ))}
  </div>
);

export default CategorySelector;