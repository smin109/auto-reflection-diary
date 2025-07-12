from pydantic import BaseModel
from typing import List

class Entry(BaseModel):
    uid: str
    email: str
    date: str  # yyyy-mm-dd
    responses: List[str]

