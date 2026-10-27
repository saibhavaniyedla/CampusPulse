"""Create the local demo admin account. Run from backend after configuring .env."""
import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from app.main import settings

async def main():
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    email = "admin@campuspulse.com"
    await db.users.update_one({"email": email}, {"$setOnInsert": {
        "name": "Campus Admin", "email": email, "password_hash": pwd.hash("admin123"),
        "role": "admin", "roleTitle": "Facilities Administrator", "created_at": datetime.now(timezone.utc)
    }}, upsert=True)
    print("Demo admin ready: admin@campuspulse.com / admin123")
    client.close()

if __name__ == "__main__": asyncio.run(main())
