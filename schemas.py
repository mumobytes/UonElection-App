from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# =========================
# VOTER AUTH SCHEMAS
# =========================

class VoterLoginRequest(BaseModel):
    admission_no: str
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    admission_no: str
    otp: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    voter_id: int
    full_name: str


class MessageResponse(BaseModel):
    message: str


# =========================
# POSITION / CANDIDATE SCHEMAS
# =========================

class CandidateBase(BaseModel):
    full_name: str
    position_id: int
    image_url: Optional[str] = None


class CandidateCreate(CandidateBase):
    pass


class CandidateResponse(CandidateBase):
    candidate_id: int

    class Config:
        from_attributes = True


class PositionBase(BaseModel):
    name: str


class PositionCreate(PositionBase):
    pass


class PositionResponse(PositionBase):
    position_id: int
    candidates: List[CandidateResponse] = []

    class Config:
        from_attributes = True


# =========================
# VOTING SCHEMAS
# =========================

class VoteCreate(BaseModel):
    position_id: int
    candidate_id: int


class VoteResponse(BaseModel):
    vote_id: int
    voter_id: int
    position_id: int
    candidate_id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class BallotSubmissionResponse(BaseModel):
    message: str
    has_voted: bool


# =========================
# ADMIN SCHEMAS
# =========================

class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# =========================
# RESULTS SCHEMAS
# =========================

class CandidateResult(BaseModel):
    candidate_id: int
    full_name: str
    total_votes: int

    class Config:
        from_attributes = True


class PositionResult(BaseModel):
    position_id: int
    name: str
    results: List[CandidateResult]

    class Config:
        from_attributes = True