import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, vote, admin_auth, results
from database import engine
from models import Base

load_dotenv()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://election-app-eight.vercel.app",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="frontend/public/images"), name="images")

app.include_router(auth.router, prefix="/auth", tags=["Voter Authentication"])
app.include_router(vote.router, prefix="/vote", tags=["Voting"])
app.include_router(admin_auth.router, prefix="/admin", tags=["Admin Authentication"])
app.include_router(results.router, prefix="/admin", tags=["Election Results"])