from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import Voter, Vote, Position, Candidate
from schemas import VoteCreate, VoteResponse, BallotSubmissionResponse, PositionResponse
from app.auth import get_current_voter

router = APIRouter()


@router.get("/positions", response_model=list[PositionResponse])
def get_positions(
    current_user: dict = Depends(get_current_voter),
    db: Session = Depends(get_db)
):
    positions = db.query(Position).all()
    return positions


@router.post("/cast-vote", response_model=VoteResponse)
def cast_vote(
    payload: VoteCreate,
    current_user: dict = Depends(get_current_voter),
    db: Session = Depends(get_db)
):
    voter_id = current_user["voter_id"]

    voter = db.query(Voter).filter(Voter.voter_id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voter not found"
        )

    if voter.has_voted:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You have already completed voting"
        )

    position = db.query(Position).filter(Position.position_id == payload.position_id).first()
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )

    candidate = db.query(Candidate).filter(Candidate.candidate_id == payload.candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    if candidate.position_id != payload.position_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate does not belong to the selected position"
        )

    existing_vote = db.query(Vote).filter(
        Vote.voter_id == voter_id,
        Vote.position_id == payload.position_id
    ).first()

    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already voted for this position"
        )

    vote = Vote(
        voter_id=voter_id,
        position_id=payload.position_id,
        candidate_id=payload.candidate_id
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return vote


@router.post("/submit-ballot", response_model=BallotSubmissionResponse)
def submit_ballot(
    current_user: dict = Depends(get_current_voter),
    db: Session = Depends(get_db)
):
    voter_id = current_user["voter_id"]

    voter = db.query(Voter).filter(Voter.voter_id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voter not found"
        )

    if voter.has_voted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ballot already submitted"
        )

    total_positions = db.query(Position).count()

    voted_positions = db.query(func.count(func.distinct(Vote.position_id))).filter(
        Vote.voter_id == voter_id
    ).scalar()

    if voted_positions < total_positions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You have only voted for {voted_positions} out of {total_positions} positions"
        )

    voter.has_voted = True
    db.commit()

    return {
        "message": "Your ballot has been submitted successfully",
        "has_voted": True
    }