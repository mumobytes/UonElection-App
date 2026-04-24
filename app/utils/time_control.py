from datetime import datetime
import pytz

EAT = pytz.timezone("Africa/Nairobi")

# Set your voting end time
VOTING_END = EAT.localize(datetime(2026, 4, 24, 17, 0, 0))


def is_voting_open():
    now = datetime.now(EAT)
    return now < VOTING_END