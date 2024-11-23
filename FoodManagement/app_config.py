"""
This module contains the application configuration for the Flask app.

It includes database configurations, session settings, and security options.
The configurations use Redis for session management and SQLAlchemy for database interaction.
"""

import redis
from models import config

# pylint: disable=too-few-public-methods


params = config()


class ApplicationConfig:
    """
    Configuration class for the Flask application.

    Attributes:
        SECRET_KEY (str): Secret key used for session signing and security.
        SQLALCHEMY_DATABASE_URI (str): Database URI for connecting to a MySQL database
                                       the pymysql driver.
        SESSION_TYPE (str): The type of session interface to use (e.g., 'redis').
        SESSION_USE_SIGNER (bool): Whether to use a signer to protect session data.
        SESSION_REDIS (Redis): Redis instance for storing session data.
        SESSION_PERMANENT (bool): Whether sessions should be permanent.
        SESSION_COOKIE_SAMESITE (str): Value for the SameSite attribute of session cookies,
                                       ensuring compatibility with cross-origin requests.
        SESSION_COOKIE_SECURE (bool): Whether the session cookie should only be sent over HTTPS.
    """

    SECRET_KEY = "TESTTEST"
    SQLALCHEMY_DATABASE_URI = (
        f'mysql+pymysql://{params["user"]}:{params["password"]}@'
        f'{params["host"]}:{params["port"]}/{params["database"]}'
    )
    SESSION_TYPE = "redis"
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")

    SESSION_PERMANENT = False
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = "False"
