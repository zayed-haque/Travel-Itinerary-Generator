import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  price: number;
  currency: string;
  departure: string;
  arrival: string;
  duration: string;
}

interface PriceTrend {
  date: string;
  avgPrice: number;
}

const FlightSearch: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [priceTrend, setPriceTrend] = useState<PriceTrend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const searchFlights = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/flights/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination, date }),
      });
      if (!response.ok) throw new Error('Failed to fetch flight prices');
      const data = await response.json();
      setFlights(data.flights);
    } catch (err) {
      setError('An error occurred while fetching flight prices');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPriceTrend = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/flights/price-trend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination, date }),
      });
      if (!response.ok) throw new Error('Failed to fetch price trend');
      const data = await response.json();
      setPriceTrend(data.trend);
    } catch (err) {
      setError('An error occurred while fetching price trend');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Flight Search</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origin (e.g., PAR)"
          className="p-2 bg-gray-700 rounded"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination (e.g., NYC)"
          className="p-2 bg-gray-700 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 bg-gray-700 rounded"
        />
        <button onClick={searchFlights} className="p-2 bg-blue-500 rounded flex items-center">
          <Search size={18} className="mr-2" />
          Search Flights
        </button>
        <button onClick={fetchPriceTrend} className="p-2 bg-green-500 rounded flex items-center">
          <TrendingUp size={18} className="mr-2" />
          Price Trend
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {flights.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-2">Available Flights</h3>
          <ul className="space-y-2">
            {flights.map((flight) => (
              <li key={flight.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{flight.airline}</p>
                  <p>{new Date(flight.departure).toLocaleString()} - {new Date(flight.arrival).toLocaleString()}</p>
                  <p>Duration: {flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">{flight.price} {flight.currency}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {priceTrend.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Price Trend</h3>
          <ul className="space-y-2">
            {priceTrend.map((trend, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <p>{new Date(trend.date).toLocaleDateString()}</p>
                <p className="font-bold">{trend.avgPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;