from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nomad Backend"
    PROJECT_VERSION: str = "0.1.0"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"
    GEMINI_API_KEY: str
    JWT_SECRET: str
    UNSPLASH_ACCESS_KEY: str
    UNSPLASH_SECRET_KEY: str
    FLIGHT_API_KEY: str
    FLIGHT_API_URL: str = "https://test.api.amadeus.com/v2/shopping/flight-offers"

    class Config:
        env_file = ".env"


settings = Settings()
