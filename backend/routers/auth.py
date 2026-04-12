"""
User auth router — in-memory storage for hackathon.
POST /api/user — create user
POST /api/signin — sign in
GET /api/user/{user_id} — get user
"""
import uuid
import hashlib
from fastapi import APIRouter, HTTPException
from models.schemas import UserRequest, UserResponse, SignInRequest, SignInResponse

router = APIRouter()

# In-memory user store (no database for hackathon)
_users: dict[str, dict] = {}
# Email → user_id index for sign-in lookups
_email_index: dict[str, str] = {}


def _hash_password(password: str) -> str:
    """Simple SHA-256 hash for hackathon — not production-grade."""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/api/user", response_model=UserResponse)
async def create_user(req: UserRequest):
    """Create a new user profile."""
    # Check if email already exists
    if req.email in _email_index:
        existing_id = _email_index[req.email]
        return UserResponse(success=True, user_id=existing_id)

    user_id = str(uuid.uuid4())
    _users[user_id] = {
        "user_id": user_id,
        "name": req.name,
        "email": req.email,
        "fear_type": req.fear_type,
        "metaphor_style": req.metaphor_style,
        "guest_id": req.guest_id,
        "password_hash": _hash_password(req.password) if req.password else "",
    }
    _email_index[req.email] = user_id
    return UserResponse(success=True, user_id=user_id)


@router.post("/api/signin", response_model=SignInResponse)
async def sign_in(req: SignInRequest):
    """Sign in with email and password."""
    user_id = _email_index.get(req.email)
    if not user_id:
        return SignInResponse(success=False, user_id="", name="", fear_type=None)

    user = _users.get(user_id)
    if not user:
        return SignInResponse(success=False, user_id="", name="", fear_type=None)

    if user.get("password_hash") != _hash_password(req.password):
        return SignInResponse(success=False, user_id="", name="", fear_type=None)

    return SignInResponse(
        success=True,
        user_id=user_id,
        name=user.get("name", ""),
        fear_type=user.get("fear_type"),
    )


@router.get("/api/user/{user_id}")
async def get_user(user_id: str):
    """Get a stored user profile."""
    user = _users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Don't return password hash
    return {k: v for k, v in user.items() if k != "password_hash"}
