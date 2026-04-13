import os
import requests
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")


def send_otp_email(to_email: str, otp: str):
    try:
        url = "https://api.resend.com/emails"

        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "NASA 2026 Election OTP Verification",
            "html": f"""
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>N'ASA Election OTP Verification</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #22c55e;">{otp}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                    <br>
                    <p>Regards,<br>NASA Electoral Committee.</p>
                </div>
            """,
        }

        response = requests.post(url, headers=headers, json=payload)

        if response.status_code in [200, 201]:
            return True

        print("Resend error:", response.text)
        return False

    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False