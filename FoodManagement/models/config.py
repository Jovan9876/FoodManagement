"""
This module provides a configuration utility for retrieving database connection parameters.

The `config` function reads database connection details from environment variables
(for CI/CD environments like GitHub Actions) or a configuration file (`database.ini`) as a fallback.

Features:
- Retrieves database connection details such as user, password, host, database name, and port.
- Supports environment variables for seamless integration with cloud and CI/CD pipelines.
- Falls back to reading from a configuration file if environment variables are not set.

Functions:
    - config: Retrieves database connection parameters based on the given filename and section.

Usage:
    db_params = config()
    # db_params will be a dictionary containing keys like 'user', 'password', 'host', etc.
"""

import os
from configparser import ConfigParser


def config(filename="database.ini", section="mysql"):
    db = {}

    # First, check for environment variables (for CI/CD environments like GitHub Actions)
    db["user"] = os.getenv("MYSQL_USER", "test")
    db["password"] = os.getenv("MYSQL_PASSWORD", "test")
    db["host"] = os.getenv("MYSQL_HOST", "127.0.0.1")
    db["database"] = os.getenv("MYSQL_DB", "FoodManagement")
    db["port"] = os.getenv("MYSQL_PORT", "3306")

    # If not found, fallback to reading from the configuration file
    if not all(db.values()):
        parser = ConfigParser()
        parser.read(filename)
        if parser.has_section(section):
            params = parser.items(section)
            for param in params:
                db[param[0]] = param[1]
        else:
            raise Exception(f"Section {section} not found in the {filename} file")

    return db
