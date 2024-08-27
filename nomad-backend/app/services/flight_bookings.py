import httpx
from fastapi import HTTPException
from app.core.config import settings
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class FlightPriceService:
    """Service class for fetching flight prices and trends using the Amadeus Flight Offers API."""

    def __init__(self):
        self.api_key = settings.FLIGHT_API_KEY
        self.api_url = settings.FLIGHT_API_URL

    async def get_flight_prices(self, origin: str, destination: str, date: str):
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": date,
            "adults": 1,
            "nonStop": False,
            "max": 5,  # Limit to 5 results
        }

        headers = {"Authorization": f"Bearer {self.api_key}"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.api_url, params=params, headers=headers
                )
                response.raise_for_status()
                data = response.json()
                return self._parse_flight_data(data)
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except httpx.RequestError as e:
            logger.error(f"An error occurred while requesting: {e}")
            raise HTTPException(
                status_code=500, detail="An error occurred while fetching flight data"
            )

    def _parse_flight_data(self, data):
        """Parse the flight data from the API response"""
        flights = []
        for offer in data.get("data", []):
            flight = {
                "id": offer["id"],
                "airline": offer["validatingAirlineCodes"][0],
                "price": float(offer["price"]["total"]),
                "currency": offer["price"]["currency"],
                "departure": offer["itineraries"][0]["segments"][0]["departure"]["at"],
                "arrival": offer["itineraries"][0]["segments"][-1]["arrival"]["at"],
                "duration": offer["itineraries"][0]["duration"],
            }
            flights.append(flight)
        return flights

    async def get_price_trend(self, origin: str, destination: str, date: str):
        base_date = datetime.strptime(date, "%Y-%m-%d")
        dates = [
            (base_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(-3, 4)
        ]  # 3 days before and after

        trends = []
        for trend_date in dates:
            prices = await self.get_flight_prices(origin, destination, trend_date)
            if prices:
                avg_price = sum(flight["price"] for flight in prices) / len(prices)
                trends.append({"date": trend_date, "avgPrice": avg_price})

        return trends
