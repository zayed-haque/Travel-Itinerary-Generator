ITINERARY_PROMPT = """
As an AI travel planner, create a detailed itinerary based on the following information:

Dates: {dates}
Location: {location}
Budget: {budget}
Travelers: {travelers}
Activities: {activities}
Meal Preferences: {meal_preferences}

Please provide a detailed itinerary covering these aspects:

1. Overall Trip Summary
2. Day-by-Day Itinerary
3. Accommodation Recommendations
4. Practical Tips

Format the response as a complete and valid JSON object with these keys: "summary", "daily_itinerary", "accommodations", and "tips".
Ensure that "daily_itinerary" is an array of objects, each with "day", "activities", "meals", and "transportation" keys.
"accommodations" and "tips" should be arrays of strings.
"""

IMAGE_SEARCH_PROMPT = """
Based on the following itinerary summary, provide a list of 5-7 relevant and iconic attractions or landmarks in the destination.
These terms will be used for image searches, so focus on visually distinctive and well-known places.

Itinerary Summary:
{summary}

Provide your response as a JSON array of strings, each representing an attraction or landmark.
"""
