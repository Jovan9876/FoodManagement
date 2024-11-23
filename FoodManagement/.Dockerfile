FROM ubuntu:22.04

RUN apt-get update -y && \
    apt-get install -y python3 python3-pip

COPY ./requirements.txt /FoodManagement/requirements.txt

WORKDIR /FoodManagement

RUN pip install -r requirements.txt

COPY . /FoodManagement

# docker build -t jovan9876/food-management-backend:latest -f .\.Dockerfile .
# docker push jovan9876/food-management-backend:latest
