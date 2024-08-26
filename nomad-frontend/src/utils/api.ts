const API_URL = process.env.REACT_APP_API_URL;

export const fetchTripDetails = async (query: any, token: string | null) => {
  try {
    const response = await fetch(`${API_URL}/api/trip-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, token }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};