# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Build the TypeScript source
RUN npm run build

# Expose port 8080 to the outside world
EXPOSE 8080

# Define environment variable
ENV PORT 8080

# Run the app when the container launches
CMD ["npm", "start"]