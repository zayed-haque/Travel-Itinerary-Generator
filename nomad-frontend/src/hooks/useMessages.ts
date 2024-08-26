import { useState } from 'react';
import { Message } from '../types';
import { fetchTripDetails } from '../utils/api';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      type: 'system', 
      content: "Welcome to Nomad Travel Assistant! I'm your AI travel advisor, here to help you plan your perfect trip. Whether you need destination ideas, itinerary planning, or travel tips, I'm here to assist. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('chatToken') || null);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSubmit = async (selectedOptions: {[key: string]: string}) => {
    const userMessage: Message = { 
      id: Date.now(), 
      type: 'user', 
      content: Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join('\n') 
    };
    addMessage(userMessage);
    setIsLoading(true);

    try {
      const data = await fetchTripDetails(selectedOptions, token);
      setToken(data.token);
      localStorage.setItem('chatToken', data.token);

      let botMessage: Message = { id: Date.now() + 1, type: 'bot', content: '', images: [] };

      if (data.error) {
        botMessage.content = data.error;
      } else if (data.itinerary) {
        botMessage.content = `
Here's your personalized travel itinerary:

**Trip Summary:**
${data.itinerary.summary || "No summary available."}

**Daily Itinerary:**
${data.itinerary.daily_itinerary && data.itinerary.daily_itinerary.length > 0 
  ? data.itinerary.daily_itinerary.map((day: any, index: number) => `
Day ${index + 1}:
Activities: ${Array.isArray(day.activities) ? day.activities.join(', ') : 'No activities specified'}
Meals: ${Array.isArray(day.meals) ? day.meals.join(', ') : 'No meals specified'}
Transportation: ${Array.isArray(day.transportation) ? day.transportation.join(', ') : 'No transportation specified'}
`).join('\n')
  : "No daily itinerary available."}

**Accommodation Recommendations:**
${Array.isArray(data.itinerary.accommodations) && data.itinerary.accommodations.length > 0
  ? data.itinerary.accommodations.join('\n')
  : "No accommodation recommendations available."}

**Practical Tips:**
${Array.isArray(data.itinerary.tips) && data.itinerary.tips.length > 0
  ? data.itinerary.tips.join('\n')
  : "No practical tips available."}`;

        botMessage.images = data.itinerary.images;
      } else {
        botMessage.content = "I'm sorry, but I couldn't generate an itinerary with the provided information. Could you please provide more details about your trip?";
      }

      addMessage(botMessage);
    } catch (error) {
      console.error('Error:', error);
      addMessage({ 
        id: Date.now() + 1, 
        type: 'bot', 
        content: "I apologize, but I encountered an error while processing your request. Could you please try again or rephrase your question?" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, handleSubmit };
};