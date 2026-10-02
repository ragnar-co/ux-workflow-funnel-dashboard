FROM python:3.12-slim

WORKDIR /srv/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY data ./data
COPY conftest.py .

# Persist the DuckDB file outside the image layer when deployed (mount a
# Coolify volume at /srv/app/data/app).
VOLUME ["/srv/app/data/app"]

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
