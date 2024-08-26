from typing import Dict, Any, Union, List
import json
import logging
import google.generativeai as genai
from app.core.config import settings
from aiohttp import ClientSession
import re
from app.artefacts.prompts import ITINERARY_PROMPT, IMAGE_SEARCH_PROMPT

logger = logging.getLogger(__name__)


class TripDetailsService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.unsplash_access_key = settings.UNSPLASH_ACCESS_KEY
        self.unsplash_secret_key = settings.UNSPLASH_SECRET_KEY

    async def process_trip_details(self, user_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process user input to generate a complete trip itinerary with images.
        """
        logger.info(f"Processing trip details: {user_input}")

        try:
            itinerary = await self._generate_itinerary(user_input)
            parsed_itinerary = self._parse_itinerary(itinerary)
            image_search_terms = await self._generate_image_search_terms(parsed_itinerary)
            enriched_itinerary = await self._enrich_with_images(parsed_itinerary, image_search_terms)
            return {"itinerary": enriched_itinerary}
        except Exception as e:
            logger.error(f"Error processing trip details: {str(e)}", exc_info=True)
            return {"error": f"An error occurred while processing your trip details: {str(e)}. Please try again."}

    async def _generate_itinerary(self, user_input: Dict[str, Any]) -> str:
        """
        Generate a trip itinerary based on user input using the Gemini model.
        """
        # Create a dictionary with lowercase keys for consistent access
        input_data = {k.lower(): v for k, v in user_input.items()}

        prompt = ITINERARY_PROMPT.format(
            dates=input_data.get('dates', 'Not specified'),
            location=input_data.get('location', 'Not specified'),
            budget=input_data.get('budget', 'Not specified'),
            travelers=input_data.get('travelers', 'Not specified'),
            activities=input_data.get('activities', 'Not specified'),
            meal_preferences=input_data.get('meal preferences', 'Not specified')
        )

        try:
            response = self.model.generate_content(prompt)
            generated_itinerary = response.text.strip()
            logger.info(f"Generated itinerary (first 100 chars): {generated_itinerary[:100]}")
            return generated_itinerary
        except Exception as e:
            logger.error(f"Error generating itinerary: {str(e)}")
            raise

    def _parse_itinerary(self, itinerary_str: str) -> Dict[str, Any]:
        """
        Parse the generated itinerary string into a structured dictionary.
        """
        try:
            itinerary_str = self._extract_json(itinerary_str)
            itinerary_str = self._preprocess_json(itinerary_str)

            itinerary = json.loads(itinerary_str)
            if not isinstance(itinerary, dict):
                raise ValueError("Parsed itinerary is not a dictionary")
            return itinerary
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing itinerary JSON: {str(e)}")
            logger.error(f"Problematic JSON string: {itinerary_str}")
            raise ValueError(f"Invalid itinerary format: {str(e)}")

    @staticmethod
    def _extract_json(text: str) -> str:
        """
        Extract JSON content from a string.
        """
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        if json_start != -1 and json_end != -1:
            return text[json_start:json_end]
        return text

    @staticmethod
    def _preprocess_json(json_str: str) -> str:
        """
        Preprocess JSON string to fix common formatting issues.
        """
        json_str = re.sub(r'"\s*\n\s*"', '",\n"', json_str)
        json_str = re.sub(r"}\s*\n\s*{", "},\n{", json_str)
        json_str = re.sub(r",\s*]", "]", json_str)
        json_str = re.sub(r",\s*}", "}", json_str)
        return json_str

    async def _generate_image_search_terms(self, itinerary: Dict[str, Any]) -> List[str]:
        """
        Generate image search terms based on the itinerary summary.
        """
        prompt = IMAGE_SEARCH_PROMPT.format(summary=itinerary.get('summary', 'A trip focusing on sightseeing and cultural experiences.'))

        try:
            response = self.model.generate_content(prompt)
            raw_response = response.text.strip()
            search_terms = self._extract_json_array(raw_response)
            logger.info(f"Generated image search terms: {search_terms}")
            return search_terms
        except Exception as e:
            logger.error(f"Error generating image search terms: {str(e)}")
            return []

    @staticmethod
    def _extract_json_array(text: str) -> List[str]:
        """
        Extract a JSON array from a string.
        """
        json_match = re.search(r"\[.*\]", text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            return json.loads(json_str)
        raise ValueError("No valid JSON array found in the response")

    async def _enrich_with_images(self, itinerary: Dict[str, Any], image_search_terms: List[str]) -> Dict[str, Any]:
        """
        Enrich the itinerary with images based on the search terms.
        """
        if not image_search_terms:
            logger.warning("No image search terms available. Skipping image enrichment.")
            return itinerary

        async with ClientSession() as session:
            attraction_images = await self._fetch_multiple_images(session, image_search_terms, "attraction")
            logger.info(f"Fetched {len(attraction_images)} images for attractions")
            itinerary["images"] = attraction_images

        return itinerary

    async def _fetch_multiple_images(self, session: ClientSession, queries: List[str], image_type: str) -> List[Dict[str, str]]:
        """
        Fetch multiple images based on the given queries.
        """
        images = []
        for query in queries:
            image = await self._fetch_image(session, query, image_type)
            if image:
                image["search_term"] = query
                images.append(image)
                logger.info(f"Fetched image for '{query}'")
            else:
                logger.warning(f"No image found for '{query}'")
        return images

    async def _fetch_image(self, session: ClientSession, query: str, image_type: str) -> Dict[str, str]:
        """
        Fetch a single image from Unsplash API based on the query.
        """
        url = "https://api.unsplash.com/search/photos"
        params = {
            "query": query,
            "per_page": 1,
            "client_id": self.unsplash_access_key,
            "client_secret": self.unsplash_secret_key,
        }
        try:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    if data["results"]:
                        image = data["results"][0]
                        return {
                            "url": image["urls"]["small"],
                            "attribution": f"Photo by {image['user']['name']} on Unsplash",
                        }
                else:
                    logger.warning(f"Unsplash API returned status code {response.status} for query '{query}'")
        except Exception as e:
            logger.error(f"Error fetching image for {image_type} '{query}': {str(e)}")
        return {}

    def validate_trip_details(self, details: Dict[str, Any]) -> Dict[str, str]:
        """
        Validate the user-provided trip details.
        """
        errors = {}
        required_fields = ["Location", "Dates"]
        for field in required_fields:
            if not details.get(field):
                errors[field] = f"{field} is required for planning your trip."
        return errors
