"""
Arjun AI Mentor — Gemini-powered financial mentor router.
POST /api/mentor
"""
import os
from fastapi import APIRouter
from models.schemas import MentorRequest, MentorResponse

router = APIRouter()

# ── System prompt ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Arjun, a calm stoic financial mentor for young Indians aged 18–28.
Never use jargon without explaining it.
Always give rupee amounts not percentages.
Frame worst cases as survivable and temporary.
Max 60 words unless asked for more.

Adapt your metaphors based on the user's fear type:
- loss → focus on survivability, historical recovery, worst-case rupee amounts
- jargon → use simple analogies, explain every term inline, no shortcuts
- scam → cite SEBI regulations, data sources, show regulatory proof
- trust → lead with mathematical proofs, index fund data, minimize personality

You are warm but direct. You never sell anything. You help people understand investing through empathy.
If you don't know something, say so honestly. Never make up financial data."""


# ── Fear type routing ────────────────────────────────────────────────────────

FEAR_CONTEXT = {
    "loss": "The user fears losing money. Always show worst-case rupee amounts first, then show median recovery. Frame losses as temporary and survivable.",
    "jargon": "The user is intimidated by financial terms. Wrap every term in a simple explanation. Use analogies. Never assume they know anything.",
    "scam": "The user suspects all financial products may be scams. Always cite SEBI, AMFI, or RBI regulations. Show data source links. Build trust through transparency.",
    "trust": "The user doesn't trust fund managers or financial apps. Lead with index fund math and historical data. Minimize your personality — let the numbers speak.",
}


@router.post("/api/mentor", response_model=MentorResponse)
async def mentor_chat(req: MentorRequest):
    """Handle a chat message to Arjun, the AI financial mentor."""
    try:
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            return MentorResponse(
                reply="I'm not fully connected yet — the GEMINI_API_KEY hasn't been set in the backend .env file. "
                      "Once it's configured, I'll be able to have a real conversation with you. "
                      "In the meantime, check out the Learn section for answers to common questions."
            )

        import google.generativeai as genai
        genai.configure(api_key=api_key)

        fear_context = FEAR_CONTEXT.get(req.fear_type, "")
        metaphor_note = f"The user prefers a '{req.metaphor_style}' communication style." if req.metaphor_style != "generic" else ""

        full_system = f"{SYSTEM_PROMPT}\n\n{fear_context}\n{metaphor_note}"

        # Build conversation history for Gemini
        history = []
        for msg in req.conversation_history[:-1]:  # exclude the latest user message
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content],
            })

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=full_system,
        )

        chat = model.start_chat(history=history)
        response = chat.send_message(req.message)

        return MentorResponse(reply=response.text)

    except Exception as e:
        print(f"Mentor API error: {e}")
        return MentorResponse(
            reply="I'm having a bit of trouble right now. Please try again in a moment. "
                  "If this keeps happening, check if the GEMINI_API_KEY in the backend .env file is valid."
        )
