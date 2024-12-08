# Food Management Application

## Overview

The Food Management Application is designed to help users efficiently manage their food inventory, track expiration dates, and reduce food waste. It allows users to input and manage food quantities, receive expiration notifications, generate shopping lists, and view nutritional information. This application is useful for individuals, families, students, and food banks who need a practical solution for keeping track of food supplies.

---

## Setup Instructions

Follow these steps to set up and run the Food Management Application on your local machine:

### Prerequisites

Ensure you have the following installed:
- Python (3.8 or higher)
- Docker and Docker Compose
- Node.js (for the frontend)

---

### Configure Environment Variables

1. **`.env` file**  
   Create a `.env` file in the `deployment` directory and add the following content:

   ```env
   DATABASE=FoodManagement
   HOST=mysql
   PORT=3306
   USER=test
   PASSWORD=test
   ROOT_PASS=test
   CONSUMER_KEY=<Your_FatSecretAPI_Consumer_Key>
   CONSUMER_SECRET=<Your_FatSecretAPI_Consumer_Secret>

2. **`database.ini` file** 
   Create a `database.ini` file in the `FoodManagement` directory and add the following content:
   
    ```ini
    [mysql]
    host=mysql
    port=3306
    database=FoodManagement
    user=test
    password=test
    redis=redis

---

## Running the App

Run the command "docker compose up -d" if you want to pull latest image from dockerhub
OR
"docker compose up -d --build" to build your own changes


