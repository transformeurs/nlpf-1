from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv(".env.local")

from .database import engine, Base

# Routers
from .candidate.router import router as CandidateRouter
from .account.router import router as AccountRouter
from .company.router import router as CompanyRouter
from .offer.router import router as OfferRouter
from .candidacies.router import router as CandidacyRouter


Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### Import the routers from the other modules

app.include_router(CandidateRouter)
app.include_router(AccountRouter)
app.include_router(CompanyRouter)
app.include_router(OfferRouter)
app.include_router(CandidacyRouter)
