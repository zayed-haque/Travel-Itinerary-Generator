import google.generativeai as genai
from app.core.config import settings
from app.models.schemas import ChatResponse
import logging
import jwt

logger = logging.getLogger(__name__)


class ChatSearchService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.system_prompt = """
        You are an AI-powered travel assistant named Nomad. Your role is to help users plan their trips by providing information, recommendations, and answering their travel-related questions. You
        have access to a vast knowledge base about destinations, accommodations, transportation, activities, and more.

        When responding to users, keep in mind the following guidelines:
        - Be friendly, helpful, and engaging in your interactions.
        - Provide clear, concise, and relevant information to address the user's query.
        - If you don't have a direct answer or are unsure, offer alternative suggestions or resources.
        - Encourage users to provide more details about their preferences and needs to better assist them.
        - Maintain a professional and empathetic tone throughout the conversation.
        - If the query is not related to travel or is inappropriate, gently guide the user back to the topic of travel planning.
        """

    async def process_query(self, query: str, token: str = None) -> ChatResponse:
        logger.info(f"Processing query: {query}")

        chat_history = []
        if token:
            try:
                decoded_token = jwt.decode(
                    token, settings.JWT_SECRET, algorithms=["HS256"]
                )
                logger.info(f"Decoded token: {decoded_token}")
                chat_history = decoded_token.get("chat_history", [])
                logger.info(f"Extracted chat history: {chat_history}")
            except jwt.ExpiredSignatureError:
                logger.warning("JWT token has expired")
            except jwt.InvalidTokenError:
                logger.warning("Invalid JWT token")

        chat_history_prompt = "\n".join(
            [f"{message['role']}: {message['content']}" for message in chat_history]
        )
        logger.info(f"Constructed chat history prompt: {chat_history_prompt}")

        prompt = f"""
        {self.system_prompt}

        {chat_history_prompt}

        User: {query}
        Nomad: """

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            chat_history.append({"role": "User", "content": query})
            chat_history.append({"role": "Nomad", "content": response_text})

            new_token = jwt.encode(
                {"chat_history": chat_history}, settings.JWT_SECRET, algorithm="HS256"
            )

            return ChatResponse(type="chat", content=response_text, token=new_token)
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return ChatResponse(
                type="chat",
                content="I apologize for the inconvenience, but I am currently unable to assist with your request. Please try again later or contact our support team for further assistance.",
            )
