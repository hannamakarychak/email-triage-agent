from fastapi.middleware.cors import CORSMiddleware

from app.fast_api_app import app

# Force overwrite all middlewares with a permissive one
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
