from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Voter
from schemas import (
    VoterLoginRequest,
    OTPVerifyRequest,
    AuthTokenResponse,
    MessageResponse,
)
from app.otp import generate_otp
from app.emailer import send_otp_email
from app.jwt_helper import create_access_token

router = APIRouter()


@router.post("/request-otp", response_model=MessageResponse)
def request_otp(payload: VoterLoginRequest, db: Session = Depends(get_db)):
    voter = db.query(Voter).filter(
        Voter.admission_no == payload.admission_no,
        Voter.email == payload.email
    ).first()

    if not voter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid admission number or email"
        )

    if voter.has_voted:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You have already completed voting"
        )

    otp = generate_otp()
    voter.otp = otp
    voter.otp_created_at = datetime.now()
    db.commit()

    email_sent = send_otp_email(voter.email, otp)
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP email"
        )

    return {"message": "OTP sent to your email"}


@router.post("/verify-otp", response_model=AuthTokenResponse)
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    voter = db.query(Voter).filter(
        Voter.admission_no == payload.admission_no
    ).first()

    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voter not found"
        )

    if not voter.otp or not voter.otp_created_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP request found. Please request a new OTP"
        )

    if datetime.now() > voter.otp_created_at + timedelta(minutes=5):
        voter.otp = None
        voter.otp_created_at = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
        )

    if voter.otp != payload.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    access_token = create_access_token({
        "voter_id": voter.voter_id,
        "role": "voter"
    })

    voter.otp = None
    voter.otp_created_at = None
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "voter_id": voter.voter_id,
        "full_name": voter.full_name
    }