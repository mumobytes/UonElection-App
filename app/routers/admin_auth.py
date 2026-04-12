from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Admin
from schemas import AdminLoginRequest, AdminTokenResponse
from app.password import verify_password
from app.jwt_helper import create_access_token

router = APIRouter()


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == payload.username).first()

    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token({
        "admin_id": admin.admin_id,
        "role": "admin"
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }