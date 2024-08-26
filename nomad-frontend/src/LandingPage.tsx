import React, { useState, useEffect } from 'react';
import { Send, Download } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import TravelOptions from './components/TravelOptions';
import CategorySelector from './components/CategorySelector';
import DateRangePicker from './components/DateRangePicker';
import ActivitySelector from './components/ActivitySelector';
import MessageList from './components/MessageList';
import { Message } from './types';

import { useMessages } from './hooks/useMessages';


const LandingPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [travelers, setTravelers] = useState(1);
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [mealPreferences, setMealPreferences] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const { messages, isLoading, handleSubmit } = useMessages();

  useEffect(() => {
    if (selectedActivities.length > 0) {
      setSelectedOptions(prev => ({...prev, Activities: selectedActivities.join(', ')}));
    } else {
      const { Activities, ...rest } = selectedOptions;
      setSelectedOptions(rest);
    }
  }, [selectedActivities]);

  const handleCategoryClick = (category: string) => {
    if (category === openCategory) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const dateString = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
      setSelectedOptions(prev => ({...prev, Dates: dateString}));
    }
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const handleTravelerChange = (increment: number) => {
    const newTravelers = Math.max(1, travelers + increment);
    setTravelers(newTravelers);
    setSelectedOptions(prev => ({...prev, Travelers: newTravelers.toString()}));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setSelectedOptions(prev => ({...prev, Location: e.target.value}));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
    setSelectedOptions(prev => ({...prev, Budget: e.target.value}));
  };

  const handleMealPreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMealPreferences(e.target.value);
    setSelectedOptions(prev => ({...prev, 'Meal Preferences': e.target.value}));
  };

  const handleDownload = async (message: Message) => {
    setIsDownloading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Adjust this URL as needed
      console.log('Sending request to:', `${API_URL}/api/trip-details/download`);
      console.log('With data:', { query: selectedOptions });
  
      const response = await fetch(`${API_URL}/api/trip-details/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: selectedOptions }),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with:', response.status, errorText);
        throw new Error(`Failed to download trip details: ${response.status} ${errorText}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'trip_itinerary.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading trip details:', error);
      alert(`Failed to download trip details: ${error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col justify-between p-4 overflow-hidden">
        <TravelOptions />

        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          onDownload={handleDownload}
        />

        <div className="w-full max-w-5xl mx-auto space-y-4">
          <CategorySelector 
            onCategoryClick={handleCategoryClick}
            openCategory={openCategory}
            travelers={travelers}
            onTravelerChange={handleTravelerChange}
          />

          {openCategory === 'Dates' && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
            />
          )}

          {openCategory === 'Activities' && (
            <ActivitySelector
              selectedActivities={selectedActivities}
              onActivityToggle={handleActivityToggle}
            />
          )}

          {openCategory === 'Location' && (
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter your desired location"
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
          )}

          {openCategory === 'Budget' && (
            <input
              type="text"
              value={budget}
              onChange={handleBudgetChange}
              placeholder="Enter your budget"
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
          )}

          {openCategory === 'Meal Preferences' && (
            <input
              type="text"
              value={mealPreferences}
              onChange={handleMealPreferencesChange}
              placeholder="Enter your meal preferences"
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
          )}

<div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(selectedOptions).map(([category, value]) => (
                <div key={category} className="bg-gray-800 px-3 py-1 text-sm flex items-center rounded">
                  <span>{category}: {value}</span>
                  <button
                    onClick={() => {
                      const { [category]: _, ...rest } = selectedOptions;
                      setSelectedOptions(rest);
                      if (category === 'Activities') setSelectedActivities([]);
                      if (category === 'Travelers') setTravelers(1);
                      if (category === 'Location') setLocation('');
                      if (category === 'Budget') setBudget('');
                      if (category === 'Meal Preferences') setMealPreferences('');
                    }}
                    className="ml-2 text-white hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(selectedOptions); }} className="flex items-start">
              <textarea
                value={Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  const newOptions: {[key: string]: string} = {};
                  lines.forEach(line => {
                    const [key, value] = line.split(': ');
                    if (key && value) newOptions[key] = value;
                  });
                  setSelectedOptions(newOptions);
                }}
                placeholder="Tell me about your travel plans..."
                className="flex-grow p-3 bg-transparent border-b border-white focus:outline-none focus:border-gray-500 resize-none overflow-hidden"
                rows={Object.keys(selectedOptions).length + 1}
              />
              <button type="submit" className="ml-2 p-3 self-end">
                <Send className="w-6 h-6" />
              </button>
            </form>
            {messages.length > 0 && messages[messages.length - 1].type === 'bot'}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;