from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


load_dotenv()

app = FastAPI(title="Health Timeline API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routers import patients, events, medications

app.include_router(patients.router)
app.include_router(events.router)
app.include_router(medications.router)

@app.get("/")
async def root():
    return {"message": "Health Timeline API"}