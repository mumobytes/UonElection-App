from database import SessionLocal
from models import Admin
from app.password import hash_password


def create_admin(username: str, password: str):
    db = SessionLocal()

    existing_admin = db.query(Admin).filter(Admin.username == username).first()
    if existing_admin:
        print("Admin already exists")
        db.close()
        return

    new_admin = Admin(
        username=username,
        password_hash=hash_password(password)
    )

    db.add(new_admin)
    db.commit()
    db.close()

    print(f"Admin '{username}' created successfully")


if __name__ == "__main__":
    create_admin("admin", "Admin123")