from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  database_url: str = 'postgresql+psycopg2://eshop:eshop@localhost:5432/eshop'
  secret_key: str = 'change-me'
  algorithm: str = 'HS256'
  access_token_expire_minutes: int = 60 * 24
  admin_email: str = 'admin@example.com'
  admin_password: str = 'admin123'
  seed_data_path: str = str(Path(__file__).resolve().parents[3] / 'shared' / 'products_seed.json')
  cors_origins: list[str] = ['*']

  class Config:
    env_file = '.env'
    env_file_encoding = 'utf-8'


settings = Settings()
