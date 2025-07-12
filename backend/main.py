from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from database import entry_collection
from fastapi import Body

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Entry(BaseModel):
    uid: str
    email: str
    date: str
    responses: List[str]

@app.post("/api/submit-entry")
def submit_entry(entry: Entry):
    if entry_collection.find_one({"uid": entry.uid, "date": entry.date}):
        raise HTTPException(status_code=409, detail="이미 작성된 회고입니다.")
    entry_collection.insert_one(entry.dict())
    return {"message": "회고가 저장되었습니다."}

@app.get("/api/get-entries")
def get_entries(uid: str):
    entries = list(entry_collection.find({"uid": uid}, {"_id": 0}))
    entries.sort(key=lambda x: x["date"], reverse=True)
    return entries

@app.put("/api/update-entry")
def update_entry(entry: Entry):
    result = entry_collection.update_one(
        {"uid": entry.uid, "date": entry.date},
        {"$set": {"responses": entry.responses}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="회고를 찾을 수 없습니다.")
    return {"message": "회고가 수정되었습니다."}
