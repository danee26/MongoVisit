# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies (including dev dependencies like nodemon)
RUN npm install

# Install nodemon globally (optional but helpful)
RUN npm install -g nodemon

# Copy the rest of the source code (in case not using bind mount)
COPY . .

# Expose the app's port
EXPOSE 6969

# Default command (can be overridden by docker-compose)
CMD ["nodemon", "src/server.js"]
