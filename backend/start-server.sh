#!/bin/bash
cd /home/seungmin/auto-reflection-diary/backend
source venv/bin/activate
exec uvicorn main:app --host 0.0.0.0 --port 8000
