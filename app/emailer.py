import os
from dotenv import load_dotenv
from mailjet_rest import Client

load_dotenv()

MAILJET_API_KEY = os.getenv("MAILJET_API_KEY")
MAILJET_SECRET_KEY = os.getenv("MAILJET_SECRET_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")

mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_SECRET_KEY), version='v3.1')


def send_otp_email(to_email: str, otp: str):
    try:
        data = {
            'Messages': [
                {
                    "From": {
                        "Email": FROM_EMAIL,
                        "Name": "NASA Electoral Committee"
                    },
                    "To": [
                        {
                            "Email": to_email,
                            "Name": "Voter"
                        }
                    ],
                    "Subject": "NASA 2026 Election OTP Verification",
                    "HTMLPart": f"""
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2>N'ASA Election OTP Verification</h2>
                            <p>Your One-Time Password (OTP) is:</p>
                            <h1 style="color: #22c55e;">{otp}</h1>
                            <p>This code will expire in 5 minutes.</p>
                            <p>If you did not request this code, please ignore this email.</p>
                            <br>
                            <p>Regards,<br>NASA Electoral Committee.</p>
                        </div>
                    """
                }
            ]
        }

        result = mailjet.send.create(data=data)

        if result.status_code == 200:
            return True
        else:
            print("Mailjet error:", result.json())
            return False

    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False