"""Report router — POST /api/report for PDF report generation."""

import io
from datetime import datetime
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from app.models.schemas import ReportRequest

router = APIRouter(prefix="/api", tags=["Report"])


@router.post("/report")
async def generate_report(request: ReportRequest):
    """
    Generate a PDF plant health report.

    - Accepts: JSON with disease, confidence, description, advice
    - Returns: Downloadable PDF file
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # ── Colors ─────────────────────────────────────────────────────
    green_dark = HexColor("#166534")
    green_mid = HexColor("#22c55e")
    gray_dark = HexColor("#1f2937")
    gray_mid = HexColor("#6b7280")
    blue_dark = HexColor("#1e40af")
    amber_dark = HexColor("#92400e")
    white = HexColor("#ffffff")

    # ── Header Background ──────────────────────────────────────────
    c.setFillColor(green_dark)
    c.rect(0, height - 100, width, 100, fill=True, stroke=False)

    # ── Header Text ────────────────────────────────────────────────
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 45, "Potato Disease Detection")

    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 70, "Plant Health Analysis Report")

    # ── Date ───────────────────────────────────────────────────────
    c.setFont("Helvetica", 10)
    c.drawCentredString(
        width / 2,
        height - 88,
        f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
    )

    # ── Separator Line ─────────────────────────────────────────────
    y = height - 120
    c.setStrokeColor(green_mid)
    c.setLineWidth(2)
    c.line(40, y, width - 40, y)

    # ── Disease Identified Section ─────────────────────────────────
    y -= 40
    c.setFillColor(green_dark)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "🔬  Disease Identified")

    y -= 25
    c.setFillColor(gray_dark)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(70, y, request.display_name)

    y -= 20
    c.setFillColor(gray_mid)
    c.setFont("Helvetica", 10)
    c.drawString(70, y, f"Class: {request.disease}")

    # ── Confidence Score Section ───────────────────────────────────
    y -= 40
    c.setFillColor(blue_dark)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "📊  Confidence Score")

    y -= 25
    c.setFillColor(gray_dark)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(70, y, f"{request.confidence:.1f}%")

    # ── Confidence bar ─────────────────────────────────────────────
    y -= 20
    bar_width = width - 140
    c.setFillColor(HexColor("#e5e7eb"))
    c.roundRect(70, y, bar_width, 12, 6, fill=True, stroke=False)
    fill_width = bar_width * (request.confidence / 100)
    c.setFillColor(green_mid)
    c.roundRect(70, y, fill_width, 12, 6, fill=True, stroke=False)

    # ── Description Section ────────────────────────────────────────
    y -= 45
    c.setFillColor(gray_dark)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "📋  Description")

    y -= 5
    c.setFillColor(gray_mid)
    c.setFont("Helvetica", 11)
    text_object = c.beginText(70, y)
    text_object.setLeading(16)
    # Word wrap the description
    words = request.description.split()
    line = ""
    for word in words:
        test_line = f"{line} {word}".strip()
        if c.stringWidth(test_line, "Helvetica", 11) < width - 140:
            line = test_line
        else:
            text_object.textLine(line)
            line = word
    if line:
        text_object.textLine(line)
    c.drawText(text_object)
    y = text_object.getY() - 15

    # ── Expert Advice Section ──────────────────────────────────────
    y -= 20
    c.setFillColor(amber_dark)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "💡  Expert Advice")

    y -= 5
    c.setFillColor(gray_dark)
    c.setFont("Helvetica", 11)
    text_object = c.beginText(70, y)
    text_object.setLeading(16)
    words = request.advice.split()
    line = ""
    for word in words:
        test_line = f"{line} {word}".strip()
        if c.stringWidth(test_line, "Helvetica", 11) < width - 140:
            line = test_line
        else:
            text_object.textLine(line)
            line = word
    if line:
        text_object.textLine(line)
    c.drawText(text_object)

    # ── Footer ─────────────────────────────────────────────────────
    c.setFillColor(gray_mid)
    c.setFont("Helvetica-Oblique", 9)
    c.drawCentredString(width / 2, 40, "Generated automatically by Potato Disease Detection AI")
    c.drawCentredString(width / 2, 28, "This report is for informational purposes. Consult an agricultural expert for treatment.")

    # ── Save ───────────────────────────────────────────────────────
    c.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=CropCare_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        },
    )
