from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import Position, Candidate, Vote
from schemas import PositionResult, CandidateResult
from app.auth import get_current_admin

router = APIRouter()


@router.get("/results/{position_id}", response_model=PositionResult)
def get_results_by_position(
    position_id: int,
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    position = db.query(Position).filter(Position.position_id == position_id).first()

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )

    candidates = db.query(Candidate).filter(Candidate.position_id == position_id).all()

    results = []
    for candidate in candidates:
        total_votes = db.query(func.count(Vote.vote_id)).filter(
            Vote.candidate_id == candidate.candidate_id,
            Vote.position_id == position_id
        ).scalar()

        results.append(
            CandidateResult(
                candidate_id=candidate.candidate_id,
                full_name=candidate.full_name,
                total_votes=total_votes
            )
        )

    results.sort(key=lambda x: x.total_votes, reverse=True)

    return PositionResult(
        position_id=position.position_id,
        name=position.name,
        results=results
    )


@router.get("/results", response_model=list[PositionResult])
def get_all_results(
    current_admin: dict = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    positions = db.query(Position).all()
    all_results = []

    for position in positions:
        candidates = db.query(Candidate).filter(
            Candidate.position_id == position.position_id
        ).all()

        position_results = []
        for candidate in candidates:
            total_votes = db.query(func.count(Vote.vote_id)).filter(
                Vote.candidate_id == candidate.candidate_id,
                Vote.position_id == position.position_id
            ).scalar()

            position_results.append(
                CandidateResult(
                    candidate_id=candidate.candidate_id,
                    full_name=candidate.full_name,
                    total_votes=total_votes
                )
            )

        position_results.sort(key=lambda x: x.total_votes, reverse=True)

        all_results.append(
            PositionResult(
                position_id=position.position_id,
                name=position.name,
                results=position_results
            )
        )

    return all_results