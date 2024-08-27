from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY
from io import BytesIO
import requests


class PDFGenerator:
    """Class for generating PDFs"""

    def __init__(self):
        self.buffer = BytesIO()
        self.styles = getSampleStyleSheet()
        self.styles.add(ParagraphStyle(name="Justify", alignment=TA_JUSTIFY))

    def generate_pdf(self, itinerary):
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        Story = []

        # Add title
        Story.append(Paragraph("Your Trip Itinerary", self.styles["Heading1"]))
        Story.append(Spacer(1, 12))

        # Add summary
        Story.append(Paragraph("Trip Summary:", self.styles["Heading2"]))
        Story.append(Paragraph(itinerary["summary"], self.styles["Justify"]))
        Story.append(Spacer(1, 12))

        # Add daily itinerary
        Story.append(Paragraph("Daily Itinerary:", self.styles["Heading2"]))
        for day in itinerary["daily_itinerary"]:
            Story.append(Paragraph(f"Day {day['day']}", self.styles["Heading3"]))
            data = [
                [
                    "Activities",
                    Paragraph(", ".join(day["activities"]), self.styles["Normal"]),
                ],
                ["Meals", Paragraph(", ".join(day["meals"]), self.styles["Normal"])],
                [
                    "Transportation",
                    Paragraph(", ".join(day["transportation"]), self.styles["Normal"]),
                ],
            ]
            t = Table(data, colWidths=[1.5 * inch, 4.5 * inch])
            t.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("WORDWRAP", (0, 0), (-1, -1)),
                    ]
                )
            )
            Story.append(t)
            Story.append(Spacer(1, 12))

        # Add accommodations
        Story.append(Paragraph("Accommodations:", self.styles["Heading2"]))
        for accommodation in itinerary["accommodations"]:
            Story.append(Paragraph(accommodation, self.styles["Normal"]))
        Story.append(Spacer(1, 12))

        # Add tips
        Story.append(Paragraph("Travel Tips:", self.styles["Heading2"]))
        for tip in itinerary["tips"]:
            Story.append(Paragraph(f"• {tip}", self.styles["Normal"]))
        Story.append(Spacer(1, 12))

        # Add images
        if "images" in itinerary and itinerary["images"]:
            Story.append(Paragraph("Trip Highlights:", self.styles["Heading2"]))
            Story.append(Spacer(1, 12))

            for img_data in itinerary["images"]:
                try:
                    img_url = img_data["url"]
                    img_attribution = img_data["attribution"]

                    # Download the image
                    response = requests.get(img_url)
                    if response.status_code == 200:
                        img = Image(
                            BytesIO(response.content), width=4 * inch, height=3 * inch
                        )
                        Story.append(img)
                        Story.append(Paragraph(img_attribution, self.styles["Italic"]))
                        Story.append(Spacer(1, 12))
                except Exception as e:
                    print(f"Error processing image: {str(e)}")

        doc.build(Story)
        self.buffer.seek(0)
        return self.buffer
