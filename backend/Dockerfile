ARG PYTHON_VERSION=3.13.7-alpine3.22

FROM python:${PYTHON_VERSION}

RUN apk update && apk upgrade

RUN python -m pip install uv

WORKDIR /backend

COPY . .

RUN apk add py3-pydantic-core

CMD ["uv", "add", "fast[api]", "langchain", "langchain-openai", "python-dotenv", "sqlalchemy", "uvicorn", "psycopg2-binary"]
    
EXPOSE 8000

CMD ["uv", "run", "main.py"]