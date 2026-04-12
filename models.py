from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    TIMESTAMP,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship
from database import Base


class Voter(Base):
    __tablename__ = "voters"

    voter_id = Column(Integer, primary_key=True, index=True)
    admission_no = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    has_voted = Column(Boolean, default=False, nullable=False)
    otp = Column(String(10), nullable=True)
    otp_created_at = Column(TIMESTAMP, nullable=True)

    votes = relationship("Vote", back_populates="voter")


class Position(Base):
    __tablename__ = "positions"

    position_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    candidates = relationship("Candidate", back_populates="position")
    votes = relationship("Vote", back_populates="position")


class Candidate(Base):
    __tablename__ = "candidates"

    candidate_id = Column(Integer, primary_key=True, index=True)
    position_id = Column(Integer, ForeignKey("positions.position_id"), nullable=False)
    full_name = Column(String(150), nullable=False)
    image_url = Column(String, nullable=True)

    position = relationship("Position", back_populates="candidates")
    votes = relationship("Vote", back_populates="candidate")


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("voter_id", "position_id", name="uq_voter_position_vote"),
    )

    vote_id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("voters.voter_id"), nullable=False)
    position_id = Column(Integer, ForeignKey("positions.position_id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.candidate_id"), nullable=False)
    timestamp = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    voter = relationship("Voter", back_populates="votes")
    position = relationship("Position", back_populates="votes")
    candidate = relationship("Candidate", back_populates="votes")


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)