import os
from configparser import ConfigParser

def config(filename="database.ini", section="mysql"):
    db = {}

    # First, check for environment variables (for CI/CD environments like GitHub Actions)
    db['user'] = os.getenv('MYSQL_USER')
    db['password'] = os.getenv('MYSQL_PASSWORD')
    db['host'] = os.getenv('MYSQL_HOST')
    db['database'] = os.getenv('MYSQL_DB')
    db['port'] = os.getenv('MYSQL_PORT')

    # Only fall back to reading the .ini file if the environment variables are not set
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
