from fastapi import FastAPI

from dotenv import load_dotenv
load_dotenv(".env.local")

from .database import engine, Base

# Routers
from .candidate.router import router as CandidateRouter
from .account.router import router as AccountRouter


Base.metadata.create_all(bind=engine)

app = FastAPI()

### Import the routers from the other modules

app.include_router(CandidateRouter)
app.include_router(AccountRouter)
