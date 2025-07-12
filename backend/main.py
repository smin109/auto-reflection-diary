from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Entry
from database import entry_collection

app = FastAPI()

# CORS 설정 (프론트엔드와 포트 다를 경우 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포 시엔 도메인 지정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/submit-entry")
def submit_entry(entry: Entry):
    existing = entry_collection.find_one({"uid": entry.uid, "date": entry.date})
    if existing:
        return {"message": "이미 작성됨"}
    entry_collection.insert_one(entry.dict())
    return {"message": "저장 성공"}
