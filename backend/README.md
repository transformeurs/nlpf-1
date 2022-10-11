# Backend

From the this directory:

```bash
poetry install
poetry shell
docker compose up -d
uvicorn app.main:app --reload
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Run tests

```bash
pytest
```

## Clear the database

```bash
docker compose down -v
```
