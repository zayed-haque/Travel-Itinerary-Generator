from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Define the schemas for the API requests and responses


class ChatRequest(BaseModel):
    """Schema for chat request"""

    query: str
    token: Optional[str] = None


class ChatResponse(BaseModel):
    """Schema for chat response"""

    type: str
    content: str
    token: str = None


class TripDetailsRequest(BaseModel):
    """Schema for trip details request"""

    query: Dict[str, Any]
    token: Optional[str] = None


class TripDetailsResponse(BaseModel):
    """Schema for trip details response"""

    itinerary: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    token: Optional[str] = None


class FlightPriceRequest(BaseModel):
    """Schema for flight price request"""

    origin: str
    destination: str
    date: str
