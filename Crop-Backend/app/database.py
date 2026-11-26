from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
import os

load_dotenv()

# Get database URL from environment or fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cropcare.db")


def make_engine(url: str):
    engine_args = {}
    if url.startswith("sqlite"):
        engine_args["connect_args"] = {"check_same_thread": False}
    elif url.startswith("postgresql"):
        engine_args["connect_args"] = {"connect_timeout": 5}
    return create_engine(url, **engine_args)


engine = make_engine(DATABASE_URL)

# Supabase/PostgreSQL can be unavailable on restricted networks. Do not stop
# the whole API at startup: transparently use a local SQLite database instead.
if not DATABASE_URL.startswith("sqlite"):
    try:
        with engine.connect():
            pass
    except SQLAlchemyError as exc:
        print(f"WARNING: Remote database unavailable ({exc.__class__.__name__}); using SQLite fallback.")
        DATABASE_URL = "sqlite:///./cropcare.db"
        engine = make_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
