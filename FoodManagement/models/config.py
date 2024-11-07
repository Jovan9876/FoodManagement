from configparser import ConfigParser

import os
from configparser import ConfigParser

def config(filename="database.ini", section="mysql"):
    db = {}
    
    # First, check for environment variables (for CI/CD environments like GitHub Actions)
    db['user'] = os.getenv('MYSQL_USER', 'test')
    db['password'] = os.getenv('MYSQL_PASSWORD', 'test')
    db['host'] = os.getenv('MYSQL_HOST', '127.0.0.1')
    db['database'] = os.getenv('MYSQL_DB', 'FoodManagement')
    db['port'] = os.getenv('MYSQL_PORT', '3306')

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

