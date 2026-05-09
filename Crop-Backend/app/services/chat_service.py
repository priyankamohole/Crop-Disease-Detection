"""
Keyword-based chatbot service for crop/plant health questions.
"""

import re
from typing import Optional

# ── Knowledge base for crop-related responses ──────────────────────────
KNOWLEDGE_BASE = {
    "greeting": {
        "patterns": [r"\b(hello|hi|hey|good morning|good evening|greetings)\b"],
        "responses": [
            "Hello! 🌱 I'm CropCare AI Assistant. How can I help you with your plants today?",
            "Hi there! 🌿 Welcome to CropCare AI. Ask me about plant diseases, care tips, or farming advice!",
        ],
    },
    "leaf_blight": {
        "patterns": [r"\b(leaf\s*blight|blight)\b"],
        "responses": [
            "**Leaf Blight** is a common fungal disease. Here's what you can do:\n"
            "1. Remove and destroy infected leaves\n"
            "2. Apply copper-based fungicide\n"
            "3. Improve air circulation around plants\n"
            "4. Avoid overhead watering\n"
            "5. Rotate crops to prevent recurrence",
        ],
    },
    "powdery_mildew": {
        "patterns": [r"\b(powdery\s*mildew|white\s*powder|white\s*spots?\s*on\s*leaves?)\b"],
        "responses": [
            "**Powdery Mildew** appears as white, powdery patches on leaves. To treat it:\n"
            "1. Apply neem oil or potassium bicarbonate spray\n"
            "2. Remove severely affected leaves\n"
            "3. Improve air circulation\n"
            "4. Plant resistant varieties\n"
            "5. Avoid overcrowding plants",
        ],
    },
    "rust": {
        "patterns": [r"\b(rust\s*disease|rust\s*spots?|orange\s*spots?)\b"],
        "responses": [
            "**Rust Disease** shows as orange-brown pustules on leaves. Here's how to manage it:\n"
            "1. Remove and destroy infected plant parts\n"
            "2. Apply sulfur-based fungicide\n"
            "3. Ensure good air circulation\n"
            "4. Water at the base, not overhead\n"
            "5. Use resistant varieties when available",
        ],
    },
    "tomato": {
        "patterns": [r"\b(tomato|tomatoes)\b"],
        "responses": [
            "🍅 **Tomato Care Tips:**\n"
            "• Common diseases: Early blight, Late blight, Septoria leaf spot, Bacterial spot\n"
            "• Prevention: Water at base, mulch around plants, stake for airflow\n"
            "• Treatment: Copper fungicides for fungal diseases, remove infected leaves\n"
            "• Nutrition: Use calcium-rich fertilizer to prevent blossom end rot",
        ],
    },
    "potato": {
        "patterns": [r"\b(potato|potatoes)\b"],
        "responses": [
            "🥔 **Potato Care Tips:**\n"
            "• Common diseases: Early blight, Late blight\n"
            "• Prevention: Use certified seed potatoes, rotate crops, hill soil around stems\n"
            "• Treatment: Apply chlorothalonil or mancozeb fungicides\n"
            "• Watch for: Colorado potato beetle and aphids",
        ],
    },
    "corn": {
        "patterns": [r"\b(corn|maize)\b"],
        "responses": [
            "🌽 **Corn Care Tips:**\n"
            "• Common diseases: Gray leaf spot, Common rust, Northern leaf blight\n"
            "• Prevention: Use resistant hybrids, rotate crops\n"
            "• Treatment: Apply foliar fungicides at tasseling for severe cases\n"
            "• Nutrition: Ensure adequate nitrogen fertilization",
        ],
    },
    "apple": {
        "patterns": [r"\b(apple|apples)\b"],
        "responses": [
            "🍎 **Apple Tree Care Tips:**\n"
            "• Common diseases: Apple scab, Black rot, Cedar apple rust\n"
            "• Prevention: Remove fallen leaves, choose scab-resistant varieties\n"
            "• Treatment: Apply captan or myclobutanil fungicides\n"
            "• Pruning: Remove dead/diseased branches in dormant season",
        ],
    },
    "grape": {
        "patterns": [r"\b(grape|grapes|vineyard)\b"],
        "responses": [
            "🍇 **Grape Care Tips:**\n"
            "• Common diseases: Black rot, Esca, Leaf blight\n"
            "• Prevention: Good canopy management, remove mummified berries\n"
            "• Treatment: Apply mancozeb or myclobutanil from bud break\n"
            "• Trellising: Maintain proper structure for air circulation",
        ],
    },
    "watering": {
        "patterns": [r"\b(water|watering|irrigation|irrigate)\b"],
        "responses": [
            "💧 **Watering Best Practices:**\n"
            "• Water at the base of plants, not overhead (reduces disease spread)\n"
            "• Water early morning so leaves dry during the day\n"
            "• Use drip irrigation when possible\n"
            "• Mulch to retain soil moisture\n"
            "• Check soil moisture before watering — overwatering causes root rot",
        ],
    },
    "fertilizer": {
        "patterns": [r"\b(fertiliz|nutrient|npk|nitrogen|phosphorus|potassium)\b"],
        "responses": [
            "🌱 **Fertilizer Guide:**\n"
            "• **Nitrogen (N):** Promotes leaf growth — use for leafy vegetables\n"
            "• **Phosphorus (P):** Supports root and flower development\n"
            "• **Potassium (K):** Strengthens disease resistance and fruit quality\n"
            "• Test your soil before fertilizing to know what's needed\n"
            "• Organic options: compost, bone meal, fish emulsion",
        ],
    },
    "pest": {
        "patterns": [r"\b(pest|insect|bug|aphid|caterpillar|beetle|worm)\b"],
        "responses": [
            "🐛 **Pest Management:**\n"
            "• **Aphids:** Spray with neem oil or insecticidal soap\n"
            "• **Caterpillars:** Use Bt (Bacillus thuringiensis) spray\n"
            "• **Beetles:** Hand-pick or use row covers\n"
            "• **General:** Encourage beneficial insects (ladybugs, lacewings)\n"
            "• Use integrated pest management (IPM) approaches",
        ],
    },
    "organic": {
        "patterns": [r"\b(organic|natural|chemical.free)\b"],
        "responses": [
            "🌿 **Organic Disease Management:**\n"
            "• Use neem oil as a natural fungicide and insecticide\n"
            "• Apply compost tea for beneficial microorganisms\n"
            "• Use copper-based sprays (approved for organic farming)\n"
            "• Practice crop rotation and companion planting\n"
            "• Build healthy soil with compost and cover crops",
        ],
    },
    "help": {
        "patterns": [r"\b(help|what can you do|features|options|commands)\b"],
        "responses": [
            "🤖 **I can help you with:**\n"
            "• Plant disease identification and treatment\n"
            "• Crop-specific care tips (tomato, potato, corn, apple, grape, etc.)\n"
            "• Watering and irrigation advice\n"
            "• Fertilizer and nutrition guidance\n"
            "• Pest management solutions\n"
            "• Organic farming practices\n\n"
            "Just type your question and I'll do my best to help!",
        ],
    },
    "thank": {
        "patterns": [r"\b(thank|thanks|thx|ty)\b"],
        "responses": [
            "You're welcome! 🌱 Feel free to ask if you have more questions about your crops!",
            "Happy to help! 🌿 Don't hesitate to reach out anytime about plant health.",
        ],
    },
    "how_to_use": {
        "patterns": [r"\b(how to use|how does this work|tutorial|guide|instructions)\b"],
        "responses": [
            "It's easy! 📸 Go to the **Detect** page, upload a clear photo of a plant leaf, and click 'Detect Disease'. You can then download a detailed PDF report of the findings!",
        ],
    },
    "cropcare": {
        "patterns": [r"\b(cropcare|about this app|who made this|purpose)\b"],
        "responses": [
            "CropCare AI is designed to help farmers and gardeners identify plant diseases quickly using Deep Learning (MobileNetV2). Our goal is to promote healthier crops and better yields! 🌱",
        ],
    },
    "bye": {
        "patterns": [r"\b(bye|goodbye|see you|exit|quit)\b"],
        "responses": [
            "Goodbye! 👋 Take good care of your plants. Come back anytime you need help!",
            "See you later! 🌾 Happy farming!",
        ],
    },
}

DEFAULT_RESPONSE = (
    "I'm not sure about that specific topic. Here are some things I can help with:\n"
    "• Ask about specific crops: tomato, potato, corn, apple, grape\n"
    "• Ask about diseases: blight, mildew, rust\n"
    "• Ask about care: watering, fertilizer, pest control\n"
    "• Type **help** to see all options\n\n"
    "You can also upload a leaf image on the Detect page for AI-powered disease analysis! 📸"
)


def get_chat_response(message: str) -> str:
    """Get a response for a user chat message."""
    message_lower = message.lower().strip()

    if not message_lower:
        return "Please type a message and I'll try to help! 😊"

    # Check each category for pattern matches
    import random
    for category, data in KNOWLEDGE_BASE.items():
        for pattern in data["patterns"]:
            if re.search(pattern, message_lower, re.IGNORECASE):
                return random.choice(data["responses"])

    return DEFAULT_RESPONSE
