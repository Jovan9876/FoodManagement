FROM ubuntu:22.04

RUN apt-get update -y && \
    apt-get install -y python3 python3-pip

COPY ./requirements.txt /FoodManagement/requirements.txt

WORKDIR /FoodManagement

RUN pip install -r requirements.txt

COPY . /FoodManagement

# docker build -t my-backend:latest -f .\.Dockerfile .
# docker run -p 3000:3000 --name food-management-backend food-management-backend:latest
# docker run --name backend food-management-backend:latest
