
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Optional

from bson import ObjectId
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from pydantic_settings import BaseSettings


# ==================================================
# SETTINGS
# ==================================================

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://127.0.0.1:27017"
    database_name: str = "campuspulse"
    jwt_secret: str = "development-only-change-this-secret"
    frontend_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

client = AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.database_name]

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# ==================================================
# DATABASE LIFECYCLE
# ==================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.command("ping")
    await db.users.create_index("email", unique=True)
    await db.problems.create_index([("created_at", -1)])

    yield

    client.close()


app = FastAPI(
    title="CampusPulse API",
    version="1.0.0",
    lifespan=lifespan,
)

# ==================================================
# CORS
# ==================================================

allowed_origins = list({
    settings.frontend_origin.rstrip("/"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
})

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# REQUEST MODELS
# ==================================================

class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = "student"
    studentId: Optional[str] = None
    department: Optional[str] = "Computer Science"
    year: Optional[str] = "3rd Year"


class LoginIn(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None, min_length=2, max_length=80
    )
    studentId: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    roleTitle: Optional[str] = None


class ProblemIn(BaseModel):
    title: str = Field(min_length=3, max_length=140)
    description: str = Field(min_length=5, max_length=3000)
    category: str
    location: str = Field(min_length=2, max_length=180)
    image: Optional[str] = None


class StatusIn(BaseModel):
    status: str


class AdminCreateIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class InitialAdminSetupIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


# ==================================================
# SERIALIZATION
# ==================================================

def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "studentId": user.get("studentId"),
        "department": user.get("department"),
        "year": user.get("year"),
        "roleTitle": user.get("roleTitle"),
    }


def serialize_problem(problem):
    problem["id"] = str(problem.pop("_id"))

    created_at = problem.get("created_at")

    if isinstance(created_at, datetime):
        problem["date"] = created_at.date().isoformat()
    else:
        problem["date"] = datetime.now(
            timezone.utc
        ).date().isoformat()

    problem.pop("created_at", None)
    problem.pop("updated_at", None)

    return problem


# ==================================================
# JWT TOKEN
# ==================================================

def make_token(user):
    payload = {
        "sub": str(user["_id"]),
        "role": user["role"],
        "exp": datetime.now(timezone.utc)
        + timedelta(hours=12),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm="HS256",
    )


# ==================================================
# AUTHENTICATION
# ==================================================

async def current_user(
    token: str = Depends(oauth2_scheme),
):
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
        )

        user_id = payload.get("sub")

        if not user_id or not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user ID")

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await db.users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User no longer exists",
        )

    return user


async def admin_user(user=Depends(current_user)):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return user


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/api/health")
async def health():
    await db.command("ping")

    return {
        "status": "ok",
        "database": "connected",
    }


# ==================================================
# FIRST ADMIN SETUP
# Use only when no admin exists
# ==================================================

@app.post("/api/setup/first-admin", status_code=201)
async def setup_first_admin(data: InitialAdminSetupIn):
    existing_admin = await db.users.find_one({
        "role": "admin"
    })

    if existing_admin:
        raise HTTPException(
            status_code=403,
            detail="Initial admin setup has already been completed.",
        )

    email = str(data.email).lower()

    existing_user = await db.users.find_one({
        "email": email
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered.",
        )

    admin = {
        "name": data.name.strip(),
        "email": email,
        "password_hash": pwd_context.hash(data.password),
        "role": "admin",
        "studentId": None,
        "department": None,
        "year": None,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(admin)
    admin["_id"] = result.inserted_id

    return {
        "message": "First admin created successfully.",
        "user": serialize_user(admin),
    }


# ==================================================
# STUDENT REGISTRATION
# ==================================================

@app.post("/api/auth/register", status_code=201)
async def register(data: RegisterIn):
    if data.role.lower() != "student":
        raise HTTPException(
            status_code=403,
            detail="Public registration is only for students.",
        )

    email = str(data.email).lower()

    if await db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="Email is already registered.",
        )

    user = {
        "name": data.name.strip(),
        "email": email,
        "password_hash": pwd_context.hash(data.password),
        "role": "student",
        "studentId": data.studentId,
        "department": data.department,
        "year": data.year,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id

    return {
        "access_token": make_token(user),
        "token_type": "bearer",
        "user": serialize_user(user),
    }


# ==================================================
# LOGIN
# ==================================================

@app.post("/api/auth/login")
async def login(data: LoginIn):
    email = str(data.email).lower()

    user = await db.users.find_one({"email": email})

    if not user or not pwd_context.verify(
        data.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password.",
        )

    if data.role and user["role"] != data.role.lower():
        raise HTTPException(
            status_code=403,
            detail=f"This account is not a {data.role} account.",
        )

    return {
        "access_token": make_token(user),
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@app.get("/api/auth/me")
async def me(user=Depends(current_user)):
    return serialize_user(user)


# ==================================================
# PROFILE
# ==================================================

@app.patch("/api/profile")
async def update_profile(
    data: ProfileUpdate,
    user=Depends(current_user),
):
    updates = {
        key: value
        for key, value in data.model_dump(
            exclude_unset=True
        ).items()
        if value is not None
    }

    if not updates:
        return serialize_user(user)

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": updates},
    )

    user.update(updates)

    return serialize_user(user)


# ==================================================
# PROBLEMS
# ==================================================

@app.get("/api/problems")
async def list_problems(user=Depends(current_user)):
    query = (
        {}
        if user["role"] == "admin"
        else {"studentEmail": user["email"]}
    )

    problems = await (
        db.problems.find(query)
        .sort("created_at", -1)
        .to_list(length=500)
    )

    return [
        serialize_problem(problem)
        for problem in problems
    ]


@app.post("/api/problems", status_code=201)
async def create_problem(
    data: ProblemIn,
    user=Depends(current_user),
):
    if user["role"] != "student":
        raise HTTPException(
            status_code=403,
            detail="Only students can report problems.",
        )

    problem = data.model_dump()

    problem.update({
        "status": "Unresolved",
        "studentName": user["name"],
        "studentEmail": user["email"],
        "created_at": datetime.now(timezone.utc),
    })

    result = await db.problems.insert_one(problem)
    problem["_id"] = result.inserted_id

    return serialize_problem(problem)


@app.patch("/api/problems/{problem_id}/status")
async def update_problem_status(
    problem_id: str,
    data: StatusIn,
    user=Depends(admin_user),
):
    if data.status not in (
        "Unresolved",
        "In Progress",
        "Resolved",
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid status.",
        )

    if not ObjectId.is_valid(problem_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid problem ID.",
        )

    result = await db.problems.update_one(
        {"_id": ObjectId(problem_id)},
        {
            "$set": {
                "status": data.status,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    if not result.matched_count:
        raise HTTPException(
            status_code=404,
            detail="Problem not found.",
        )

    return {
        "id": problem_id,
        "status": data.status,
    }


# ==================================================
# ADMIN STATISTICS
# ==================================================

@app.get("/api/admin/stats")
async def admin_stats(user=Depends(admin_user)):
    total = await db.problems.count_documents({})
    unresolved = await db.problems.count_documents({
        "status": "Unresolved"
    })
    progress = await db.problems.count_documents({
        "status": "In Progress"
    })
    resolved = await db.problems.count_documents({
        "status": "Resolved"
    })

    return {
        "total": total,
        "unresolved": unresolved,
        "inProgress": progress,
        "resolved": resolved,
    }


# ==================================================
# CREATE ADDITIONAL ADMINS
# Requires an existing admin JWT
# ==================================================

@app.post("/api/admin/users", status_code=201)
async def create_admin_account(
    data: AdminCreateIn,
    admin=Depends(admin_user),
):
    email = str(data.email).lower()

    if await db.users.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="Email is already registered.",
        )

    new_admin = {
        "name": data.name.strip(),
        "email": email,
        "password_hash": pwd_context.hash(data.password),
        "role": "admin",
        "studentId": None,
        "department": None,
        "year": None,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(new_admin)
    new_admin["_id"] = result.inserted_id

    return {
        "message": "Admin account created successfully.",
        "user": serialize_user(new_admin),
    }
