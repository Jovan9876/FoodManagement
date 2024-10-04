import redis
from models import config


params = config()

class ApplicationConfig:
    SECRET_KEY = "TESTTEST"
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
    SESSION_TYPE = "redis"
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")

    SESSION_PERMANENT = False
    SESSION_COOKIE_SAMESITE = 'None'  # Important for cross-origin cookies
    SESSION_COOKIE_SECURE = 'False'  # Set to True if using HTTPS