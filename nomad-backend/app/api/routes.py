from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.services.chat_search import ChatSearchService
from app.services.trip_details import TripDetailsService
from app.services.flight_bookings import FlightPriceService
from app.services.pdf_generator import PDFGenerator
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    TripDetailsRequest,
    TripDetailsResponse,
    FlightPriceRequest,
)
import logging

# Intialize the router and logger
router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/chat", response_model=ChatResponse)
async def chat_search(request: ChatRequest, service: ChatSearchService = Depends()):
    """Endpoint for chat search"""
    logger.info(f"Received query: {request.query}")
    response = await service.process_query(request.query, request.token)
    return response


@router.post("/trip-details", response_model=TripDetailsResponse)
async def process_trip_details(
    request: TripDetailsRequest, service: TripDetailsService = Depends()
):
    """Endpoint for processing trip details"""
    logger.info(f"Received trip details input: {request.query}")
    try:
        details = await service.process_trip_details(request.query)
        if isinstance(details, dict) and "error" in details:
            raise HTTPException(status_code=400, detail=details["error"])
        return TripDetailsResponse(itinerary=details["itinerary"], token=request.token)
    except Exception as e:
        logger.error(f"Error processing trip details: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/flights/prices")
async def get_flight_prices(
    request: FlightPriceRequest, service: FlightPriceService = Depends()
):
    """Endpoint for getting flight prices"""
    try:
        flights = await service.get_flight_prices(
            request.origin, request.destination, request.date
        )
        return {"flights": flights}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting flight prices: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/flights/price-trend")
async def get_price_trend(
    request: FlightPriceRequest, service: FlightPriceService = Depends()
):
    """Endpoint for getting price trend"""
    try:
        trend = await service.get_price_trend(
            request.origin, request.destination, request.date
        )
        return {"trend": trend}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting price trend: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/trip-details/download")
async def download_trip_details(
    request: TripDetailsRequest,
    trip_service: TripDetailsService = Depends(),
    pdf_service: PDFGenerator = Depends(),
):
    """Endpoint for downloading trip details as A PDF"""
    try:
        trip_details = await trip_service.process_trip_details(request.query)
        if "error" in trip_details:
            raise HTTPException(status_code=400, detail=trip_details["error"])

        pdf_buffer = pdf_service.generate_pdf(trip_details["itinerary"])

        return StreamingResponse(
            iter([pdf_buffer.getvalue()]),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=trip_itinerary.pdf"},
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
