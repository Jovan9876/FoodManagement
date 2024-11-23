FROM node:16

# Set working directory
WORKDIR /client

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

EXPOSE 3000

# Start app
CMD ["npm", "start"]

# docker build -t food-management-client:latest -f .\.Dockerfile .
# docker run -p 3000:3000 --name client food-management-client:latest
