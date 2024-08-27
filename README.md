# Nomad: Personalized Travel Itinerary Generator

## Description

Nomad is a web application that generates personalized travel itineraries based on user preferences. It uses AI-powered natural language processing to create detailed trip plans, integrates flight search capabilities, and offers downloadable PDF itineraries. The application consists of a React frontend and a Python FastAPI backend.

## Features

- AI-powered chat interface for travel planning
- Personalized itinerary generation based on user preferences
- Flight search and price trend analysis
- Downloadable PDF itineraries
- Real-time updates and social sharing capabilities (To do)

## Tech Stack

### Frontend
- React with TypeScript

### Backend
- Python 3.9+
- FastAPI for API development
- Pydantic for data validation
- Google's Gemini AI

### External Services
- Unsplash API for images
- Amadeus/Skyscanner API for flight data

### Prerequisites
- Docker
- Docker Compose

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/zayed-haque/shiny-succotash.git
2. Create a `.env` file in the root directory and take the variables needed from `.env.example`
   ```sh
   GEMINI_API_KEY=
   UNSPLASH_ACCESS_KEY=
   UNSPLASH_SECRET_KEY=
   FLIGHT_API_KEY=
   REACT_APP_API_URL=
3. Build and start the Docker containers:
   ```sh
   make build - builds all the docker images
   make run - to start the services
4. For frontend services to run
   ```sh
   make frontend-dev
   ```
   or 
   ```sh
   cd nomad-frontend && npm install && npm start
5. Open your browser and navigate to http://localhost:3000 to see the application running.

#### For local development without Docker 
```sh
cd nomad-backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn app.main:app --reload
```
## Deployment
#### Backend
Deployed on Render: https://nomad-backend-bzzc.onrender.com/api

#### Frontend
Vercel: https://nomadtravel.vercel.app/

Netlify: https://nomadai.netlify.app/

![Web site](https://github.com/zayed-haque/shiny-succotash/blob/main/image.png?raw=true)