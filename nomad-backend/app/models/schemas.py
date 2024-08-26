from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ChatRequest(BaseModel):
    query: str
    token: Optional[str] = None


class ChatResponse(BaseModel):
    type: str
    content: str
    token: str = None


class TripDetailsRequest(BaseModel):
    query: Dict[str, Any]
    token: Optional[str] = None


class TripDetailsResponse(BaseModel):
    itinerary: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    token: Optional[str] = None


class FlightPriceRequest(BaseModel):
    origin: str
    destination: str
    date: str
