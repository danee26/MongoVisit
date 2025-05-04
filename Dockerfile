# Use official Node.js image
FROM node:18

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app (i.e., src/ folder)
COPY ./src /app/src

# Expose the app's port (adjust this if needed)
EXPOSE 3000

# Start the app
CMD ["node", "src/server.js"]