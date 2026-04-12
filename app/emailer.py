import os
import yagmail
from dotenv import load_dotenv

load_dotenv()


EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_otp_email(to_email: str, otp: str):
    try:
        yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASSWORD)

        subject = "NVS Election OTP Verification"
        contents = f"""
Hello,

Your One-Time Password (OTP) for the NASA Voting System is:

{otp}

This code will expire in 5 minutes.

If you did not request this code, please ignore this email.

Regards,
NVS Election Team
        """

        yag.send(
            to=to_email,
            subject=subject,
            contents=contents
        )

        return True

    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False